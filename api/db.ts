import '@std/dotenv/load';
import { drizzle } from 'drizzle-orm/node-postgres';
import process from "node:process";
import { programmes, stations, series, selected, preselects } from "./schema/schema.ts";

const user = Deno.env.get("PG_USER");
const password = Deno.env.get("PG_PASSWORD");
const host = Deno.env.get("PG_HOST");
const port = Deno.env.get("PG_PORT");
const dbname = Deno.env.get("PG_DB");

const DB_URL=`postgresql://${user}:${password}@${host}:${port}/${dbname}`;

const db = drizzle({
    connection: DB_URL
});

export const getStations = async () => await db.select().from(stations);

export default db;

