import * as log from "@std/log";
import { parse } from "node-html-parser";
import { DaySchedule, Programme, Station } from "../types/types.ts";

const getProgrammesFromDailySchedule = (page: string, station: Station ): DaySchedule => {
    const root = parse(page);
    const dateText = root.querySelectorAll("h1 time")[0].innerText;
    const date = new Date(dateText);
    const periods = root.querySelectorAll("li#early, li#morning, li#afternoon, li#evening");
    const programmes: Programme[] = []
  
    const dayProgs = periods.flatMap((period) => {
        return period.querySelectorAll("div.broadcast");
    });
    for (let i=0; i < dayProgs.length; i++) {
        const prog = dayProgs[i];
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
        if (i === dayProgs.length - 1) {
            nextHStr = "23";
            nextMStr = "59";
        } else {
            [nextHStr, nextMStr] = (dayProgs[i+1].querySelector("span.timezone--time")?.innerText?.split(":") ?? []);
        }
        const nextTime = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            parseInt(nextHStr, 10),
            parseInt(nextMStr, 10),
        );
        const image = prog.querySelector("img.image")?.getAttribute('data-src');
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
                    start: startTime.getTime(),
                    end: nextTime.getTime(),
                    duration: nextTime.getTime() - startTime.getTime(),
                },
                station: station,
            }
            programmes.push(programme);
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

const getDetailsFromProgrammePage = (page: string): {online: boolean, description: string, series?: string} => {
    // log.info("Online", page);
    const root = parse(page);
    const online = root.querySelectorAll('.playout__icon').length > 0; 
    const description = root.querySelector('.synopsis-toggle__long')?.innerText || "";
    const anchors = root.querySelectorAll('p a').map(a => a.innerText.match('See all episodes from') && a);
    let series;
    if (anchors && anchors.length > 0) {
        series = anchors[0]?.getAttribute('href')?.split('/')[2];
    }
    return ({online, description, series})
}

// const getProgrammesFromWeeklySchedule = (page: string): WeekSchedule => {
//     const root = parse(page);
//     const weekDates = root.querySelector('.week-guide__table');
//     const days = root.querySelector('.week-guide__table__day');
//     log.info(days);
    
//     const week: WeekSchedule = {
//         days: []
//     }
//     return week;
//   }

export { getProgrammesFromDailySchedule, getDetailsFromProgrammePage };
