
import * as log from "@std/log";
import * as htmlparser2 from "@victr/htmlparser2";
import { DomUtils } from "https://deno.land/x/htmlparser@v4.1.1/htmlparser2/index.ts";
import { Programme, DaySchedule, WeekSchedule } from "../types/types.ts";

const getProgrammesFromWeeklySchedule = (page: string) => {
    const dom = htmlparser2.parseDocument(page);
    log.info(`DOM: ${DomUtils.getElementById("schedule", dom)}`)
};

export {getProgrammesFromWeeklySchedule}