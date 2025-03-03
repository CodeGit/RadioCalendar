 /// <reference lib="deno.ns" />
import * as log from "@std/log";
import { Application, Router, RouterContext } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";
import { createClient, RedisClientType } from "npm:redis";
import { stationsDB, programmesDB, selectedDB } from "./db/db.ts";

import config from "../config/config.json" with { type: "json" };
import {
  getProgrammesFromDailySchedule,
} from "./radioScheduleParser.ts";

log.setup({
  handlers: {
    default: new log.ConsoleHandler("DEBUG", {
      formatter: log.formatters.jsonFormatter,
      useColors: true,
    }),
  },
});

// initialise redis cache
const cache:RedisClientType = await createClient({url:config.api.redis});
await cache.on("error", err => console.log(`Redis client error [${err}]`)).connect();

console.log("Starting API server");

const router = new Router();

router.get("/api/version", (context) => {
  context.response.body = {
    version: "1.0.0",
  };
});

router.get("/", context => {
  log.info("GET");
    context.response.redirect("/api");
});

router.post("/", context => {
  log.info("POST", context.params);
  context.response.body = {};
});

router.delete("/", context => {
  log.info("DELETE");
  context.response.redirect("/api");
});


router.get("/api", context => {
    log.info("/api");
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const date = (now.getDate()).toString().padStart(2, "0");
    context.response.redirect(`/api/station/${config.stations[0].key}/year/${year}/month/${month}/date/${date}`);
    // const week = dayjs(now).week();
    // context.response.redirect(`/api/station/${config.stations[0].key}/year/${year}/week/${week}`);
});

router.get("/api/stations", (context) => {
  log.info("/api/stations");
  context.response.body = config.stations;
});

router.get("/api/station/:station", (context) => {
  const station = config.stations.find((s) => s.key === context.params.station);
  log.info(`/api/station/${station?.key}`);
  context.response.body = station;
});

router.get(
  "/api/station/:station/year/:year/month/:month/date/:date",
  async (context) => {
    const station = config.stations.find((s) =>
      s.key === context.params.station
    );
    if (station === undefined) {
      throw new Error(`Cannot find station ${context.params.station}`);
    }
    const dayURL = station.day.replace("YEAR", context.params.year).replace(
      "MONTH",
      context.params.month,
    ).replace("DATE", context.params.date);
    log.info(`URL = ${dayURL}`);
    const page = await getCachedOrFetch(cache,dayURL);
    const events = getProgrammesFromDailySchedule(page, station);
    // log.info(
    //   `/api/station/${context.params.station}/year/${context.params.year}/month/${context.params.month}/day/${context.params.day}`,
    // );

    context.response.body = events
  },
);

router.get(
  "/api/programmes",
  (context) => {
    log.info("programmes");
    // const pageNum = context.params.page;
    // const pageSize = context.params.size;
    const { searchParams } = context.request.url;
    log.info(`SearchParam=${context.request.url.searchParams}`);
    context.response.body = {
      "message": "Hello"
    }
  }
);

router.get(
  "/api/programmes/:pid", 
  (context) => {

  }
);

router.get("/api/selected/:pid",
  async (context) => {
    const pid = context.params.pid;
    const isSelected = await selectedDB.isProgrammeSelected(pid);
    context.response.body = isSelected;
  }
);

router.put("/api/selected/:pid", async (context: RouterContext<"/api/selected/:pid">) => {
  const pid = context.params.pid;
  if (context.request.hasBody) {
    const {programme, selected} = await context.request.body.json();
    programme.selected = selected;
    if (selected) {
      await programmesDB.createOrUpdate(programme);
      await selectedDB.addSelectedProgramme(programme);
    } else {
      await programmesDB.removeIfNotRecorded(programme);
      await selectedDB.removeSelectedProgramme(programme);
    }
    context.response.body = {};
  } else {
    context.response.status = 400;
    context.response.body = {"message": "Incorrect parameters"};
  }

});

const getCachedOrFetch = async (cache: RedisClientType ,url:string):Promise<string> => {
    let page;
    if (cache)
        page = await cache.get(url);
    if (!page) {
        const response = await fetch(url);
        page = await response.text();
        await cache.set(url, page);
    }
    return (page);
};

const app = new Application();
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

export default app; // for tests

if (import.meta.main) {
  await app.listen({ hostname: config.api.host, port: config.api.port });
}
