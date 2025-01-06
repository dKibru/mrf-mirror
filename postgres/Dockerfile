FROM postgres:16
RUN apt-get update && apt-get install -y make git
COPY *.sql /docker-entrypoint-initdb.d/
