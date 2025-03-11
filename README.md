# Radio Calendar: View radio schedules and select and listen to programmes

This app allows viewing of weekly radio schedules and creation of lists of selected programmes for listening.

## Prerequisites

The app is built on [Deno 2](https://deno.com/) for the API and [React](https://react.dev/) for the front end. The API uses [drizzle](https://orm.drizzle.team/) for database schema management and querying. The API also requires containers running [Redis](https://redis.io/) and [PostgreSQL](https://www.postgresql.org/). 

The front-end uses [Mantine](https://mantine.dev/) for front end componenents and [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) for front end state management. 

## Getting started

Install [deno](https://docs.deno.com/runtime/getting_started/installation/) and clone [this project](https://github.com/CodeGit/RadioCalendar).

To help with local development Redis and Postgres can be run in root-less [podman](https://podman.io/) containers.
```bash
podman  pull docker.io/library/redis:7-alpine
podman  pull docker.io/library/postgres:lalpine
```

Then create a .env file using the options shown in [.env.sample](https://github.com/CodeGit/RadioCalendar/blob/main/.env.sample)

The database can then be initialised by running

```bash
deno task drizzle:push
```

