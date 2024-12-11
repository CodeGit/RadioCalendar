import * as log from "@std/log";
import { Application, Router } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";
import config from "./config/config.json" with { type: "json" };
import { Programme } from "../types/types.ts";
import { getProgrammesFromWeeklySchedule } from './radioScheduleParser.ts'

log.setup({
    handlers: {
        default: new log.ConsoleHandler("DEBUG", {
            formatter: log.formatters.jsonFormatter,
            useColors: true
        }),
    },
});

const router = new Router();

router.get("/api/version", (context) => {
    context.response.body = {
        version: "1.0.0"
    };
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

router.get("/api/station/:station/year/:year/week/:week", async (context) => {
    const station = config.stations.find((s) => s.key === context.params.station);
    if (station === undefined)
        throw new Error(`Cannot find station ${context.params.station}`);
    const weekURL = station.week.replace("YEAR", context.params.year).replace("WEEK_OF_YEAR", context.params.week);
    const response = await fetch(weekURL);
    const page = await response.text();
    getProgrammesFromWeeklySchedule(page);
    log.info(`/api/station/${context.params.station}/year/${context.params.year}/week/w${context.params.week}`);

    context.response.body = { text: "Successfully downloaded page" };
});

const app = new Application();
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods())

export default app // for tests

if (import.meta.main) {
    await app.listen({ port: 8081 }); //TODO: get port from config
}
