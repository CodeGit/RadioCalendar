source ./.env;
podman run -d --rm --replace \
        -p 6379:6379 \
        --name radiocalendar-redis \
        redis:7-alpine redis-server;

podman run -d --rm --replace \
        --name radiocalendar-postgres \
        -e PGDATA=/var/lib/postgresql/data/pgdata \
	    -e LANG=en_GB.utf8 \
        -e POSTGRES_INITDB_ARGS="--locale-provider=icu --icu-locale=en-GB" \
        -e POSTGRES_DB=${POSTGRES_DB} \
        -e POSTGRES_PASSWORD=${POSTGRES_PASSWORD} \
        -p 5432:5432 \
        postgres:alpine
  # -v /home/maq/source/RadioCalendar/pg-data:/var/lib/postgresql/data \
      