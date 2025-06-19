FROM postgis/postgis:17-3.5

RUN apt-get update -y && apt-get install postgis wget unzip gdal-bin -y
RUN apt-get clean
RUN rm -rf /var/cache/apt/lists

WORKDIR /app

COPY country_init.sh /app/country_init.sh
COPY entrypoint.sh /app/entrypoint.sh

RUN chmod +x /app/country_init.sh /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]