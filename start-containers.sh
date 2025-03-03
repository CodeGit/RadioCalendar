#!/usr/bin/env bash
export $(grep -v '^#' .env | xargs);

podman run -d --rm --replace \
        -p 6379:6379 \
        --name radiocalendar-redis \
        redis:7-alpine redis-server;

podman run -d --rm --replace \
        --name radiocalendar-postgres \
        -e PGDATA=/var/lib/postgresql/data/pgdata \
	    -e LANG=en_GB.utf8 \
        -e POSTGRES_INITDB_ARGS="--locale-provider=icu --icu-locale=en-GB" \
        -e POSTGRES_DB=${PG_DB} \
        -e POSTGRES_PASSWORD=${PG_PASSWORD} \
        -p 5432:5432 \
        postgres:alpine
      