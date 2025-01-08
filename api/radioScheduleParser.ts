import * as log from "@std/log";
import { HTMLElement, parse } from "node-html-parser";
import { DaySchedule, Programme } from "../types/types.ts";


const getProgrammesFromDailySchedule = (page: string): DaySchedule => {
  const root = parse(page);
  const dateText = root.querySelectorAll("h1 time")[0].innerText;
  const date = new Date(dateText);
  const validDaySubdivisions = ['early', 'morning', 'afternoon', 'evening'];
  const periods = [];
  const programmes: Programme[] = []
  for(const subdivision of validDaySubdivisions) {
    const dayDivision = root.querySelector(`li#${subdivision}`)
    if (dayDivision)
        periods.push(dayDivision);
  }
  for (const period of periods) {
    const progs = period.querySelectorAll("div.broadcast");
    for (let i=0; i < progs.length; i++) {
        const prog = progs[i];
        const [hStr, mStr] = (prog.querySelector("span.timezone--time")?.innerText?.split(":") ?? []);
        const startTime = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            parseInt(hStr),
            parseInt(mStr),
        );
        let nextHStr: string;
        let nextMStr: string;
        if (i+1 < progs.length) {
            [nextHStr, nextMStr] = (progs[i+1].querySelector("span.timezone--time")?.innerText?.split(":") ?? []);
        } else {
            nextHStr = "23";
            nextMStr = "59";
        }
        const nextTime = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            parseInt(nextHStr, 10),
            parseInt(nextMStr, 10),
        );
        const image = prog.querySelector("img.image")?.getAttribute('src');
        const title = prog.querySelector("span.programme__title")?.innerText;
        const subtitle = prog.querySelector("span.programme__subtitle")?.innerText;
        const link = prog.querySelector("a")?.getAttribute('href');
        const pid = link?.split("/").pop();
        const descriptions = prog.querySelectorAll("p.programme__synopsis span");
        let description: string;
        let episode_number = 0;
        let episode_total = 0;
        if (descriptions.length === 1) {
            description = descriptions[0].innerText;
        } else {
            episode_number = parseInt(descriptions[0].innerText, 10);
            episode_total = parseInt(descriptions[1].innerText, 10);
            description = descriptions[2].innerText;
        }
        if (title && pid && link && startTime) {
            const programme: Programme = {
                title: title,
                subtitle: subtitle,
                synopsis: description,
                episode: episode_number,
                episode_total: episode_total,
                pid: pid ? pid : "",
                url: link,
                image: image,
                time: {
                start: startTime,
                end: nextTime,
                duration: nextTime.getTime() - startTime.getTime(),
                }
            }
            programmes.push(programme);
            log.info(`Created ${title} (${pid}) ${episode_number}/${episode_total}: ${startTime.toUTCString()}`);
        }
    }
  }
  
  const schedule: DaySchedule = {
    day: date.getDate(),
    month: date.getMonth(),
    year: date.getFullYear(),
    programmes: programmes,
  };
  return schedule;
};

export { getProgrammesFromDailySchedule };
