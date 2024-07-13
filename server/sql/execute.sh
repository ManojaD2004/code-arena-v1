docker build -t vol-db-psql -f Dockerfile.sql  ./ 
docker volume create vol-db-storage-v1
docker run --name vol-db-psql-v1 -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d -v vol-db-storage-v1:/var/lib/postgresql/data  vol-db-psql
docker run -it --rm --network host postgres psql -h localhost -U postgres