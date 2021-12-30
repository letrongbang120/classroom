FROM mongo

COPY migrate-data.json /migrate-data.json
CMD mongoimport --host my_database:27017 --db classroom --collection account --type json --file /migrate-data.json --jsonArray