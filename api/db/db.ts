import '@std/dotenv/load';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq, and, ne } from "npm:drizzle-orm/expressions";
import { programmes, stations, series, selected, preselects } from "../schema/schema.ts";
import config from "../../config/config.json" with { type: "json" };
import * as log from "@std/log";
import { Programme, Station, Event } from "../../types/types.ts";

const user = Deno.env.get("PG_USER");
const password = Deno.env.get("PG_PASSWORD");
const host = Deno.env.get("PG_HOST");
const port = Deno.env.get("PG_PORT");
const dbname = Deno.env.get("PG_DB");

const DB_URL=`postgresql://${user}:${password}@${host}:${port}/${dbname}`;

const db = drizzle({
    connection: DB_URL
});

export const initialise = async () => {
    const dbStationPids = (await db.select().from(stations))?.map( s => s.pid);
    const configPids = config.stations.map( s => s.id);
    const missingFromConfigPids = dbStationPids.filter(
        pid => !configPids.includes(pid)
    );
    missingFromConfigPids.forEach(async (pid) => {
        log.info(`Deleting station ${pid}`);
        await db.delete(stations).where(eq(stations.pid, pid))
    });
    config.stations.forEach(async (s) => {
        log.info(`Updating station ${s.name}`)
        await db.insert(stations)
        .values({
            pid: s.id,
            name: s.name
        })
        .onConflictDoUpdate({
            target: stations.pid, set: {name: s.name}
        })
    });
}
await initialise();

export const stationsDB = {
    getStations: async () => {
        return await db.select().from(stations)
    },
    getStation: async (pid: string): Promise<Station|null>  => {
        const [match] = await db.select().from(stations).where(eq(stations.pid, pid));
        if (match) {

        }
        return null;
    }
};

export const selectedDB = {
    addSelectedProgramme: async (programme: Programme) => {
        log.info("Add Selected: ", programme.pid);
        return db.insert(selected).values({
            pid: programme.pid,
        }).onConflictDoNothing();
    },

    removeSelectedProgramme: async (programme: Programme) => {
        log.info("Delete selected: ", programme.pid);
        return db.delete(selected).where(eq(selected.pid, programme.pid));
    },

    getSelectedProgrammes: async (query: any):Promise<Programme[]> => {
        const programmes: Programme[] | PromiseLike<Programme[]>  = [];

        return programmes;
    },

    isProgrammeSelected: async (query: string):Promise<boolean> => {
        const pid = await db.select().from(selected).where(eq(selected.pid, query));
        console.log('isProgrammeSelected', pid, query);
        return pid.length > 0;
    },
};

export const programmesDB = {
    createOrUpdate: async (programme: Programme) => {
        log.info('Creating programme ', programme.pid);
        return db.insert(programmes).values({
            pid: programme.pid,
            title: programme.title,
            subtitle: programme?.subtitle,
            synopsis: programme?.synopsis,
            description: programme?.description,
            episode: programme?.episode,
            episodeTotal: programme?.episode_total,
            station: programme.station?.id,
            url: programme.url,
            image: programme?.image,
            startTime: new Date(programme.time.start),
            endTime: new Date(programme.time.end),
            duration: programme.time.duration,
            online: programme.online,
        }).onConflictDoUpdate({
            target: programmes.pid,
            set: {
                title: programme.title,
                subtitle: programme?.subtitle,
                synopsis: programme?.synopsis,
                description: programme?.description,
                episode: programme?.episode,
                episodeTotal: programme?.episode_total,
                station: programme.station?.id,
                url: programme.url,
                image: programme?.image,
                startTime: new Date(programme.time.start),
                endTime: new Date(programme.time.end),
                duration: programme.time.duration,
            },
        });
    },
    removeIfNotRecorded: async (programme: Programme) => {
        log.info('Deleting programme ', programme.pid);
        return db.delete(programmes).where(and(
            eq(programmes.pid, programme.pid),
            ne(programmes.recorded, true)
        ));
    },
    getProgramme: async (pid: string) => {
        const [programme] = await db.select().from(programmes).where(eq(programmes.pid, pid));
        if (programme) {
            const station = await stationsDB.getStation(programme.station);
            if (station) {
                programme.station = station.id;
            }
            const time: Event = {
                start: programme.startTime.getTime(),
                end: programme.endTime.getTime(),
                duration: programme.duration
            }
            return {...programme, time: time};
        }
        return null;
    },
};
