 /// <reference lib="deno.ns" />
import * as log from "@std/log";
import { Application, Router } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";
import { createClient, RedisClientType } from "npm:redis@^4.7";
import db, { getStations } from "./db.ts";

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
// console.log(await getStations());
const router = new Router();

router.get("/api/version", (context) => {
  context.response.body = {
    version: "1.0.0",
  };
});

router.get("/", context => {
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
