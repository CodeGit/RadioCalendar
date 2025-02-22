// import '@std/dotenv/load';
import { defineConfig } from 'drizzle-kit';
import process from "node:process";

const user = Deno.env.get("PG_USER");
const password = Deno.env.get("PG_PASSWORD");
const host = Deno.env.get("PG_HOST");
const port = Deno.env.get("PG_PORT");
const dbname = Deno.env.get("PG_DB");

const DB_URL=`postgresql://${user}:${password}@${host}:${port}/${dbname}`;
console.log("DB ", DB_URL);
export default defineConfig({
  out: './drizzle',
  schema: './api/schema',
  dialect: 'postgresql',
  dbCredentials: {
    url: DB_URL,
  },
});