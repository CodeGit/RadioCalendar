import {
    boolean,
    integer,
    pgTable,
    primaryKey,
    text,
    timestamp,
} from "drizzle-orm/pg-core";

export const selected = pgTable("selected", {
    pid: text().primaryKey().notNull().references(() => programmes.pid),
});

export const preselects = pgTable("preselects", {
    dayOfWeek: integer().notNull(),
    time: timestamp().notNull() 
}, (table) => [
    primaryKey({columns: [table.dayOfWeek, table.time]})
]);

export const stations = pgTable("stations", {
    pid: text().primaryKey(),
    name: text(),
});

export const series = pgTable("series", {
    pid: text().primaryKey(),
    name: text().notNull(),
    url: text().notNull(),
    total: integer(),
});

export const programmes = pgTable("programmes", {
    pid: text().primaryKey(),
    title: text().notNull(),
    subtitle: text(),
    synopsis: text(),
    episode: integer(),
    episodeTotal: integer(),
    station: text().notNull().references(() => stations.pid),
    series: text().references(() => series.pid),
    url: text().notNull(),
    image: text(),
    online: boolean(),
    recorded: boolean(),
    recordedTime: timestamp(),
    startTime: timestamp(),
    endTime: timestamp(),
    duration: integer(),
    file: text(),
});


