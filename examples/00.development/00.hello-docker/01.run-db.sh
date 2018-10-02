# mongo
docker run -d --name=mongo -e MONGO_INITDB_ROOT_USERNAME=root \
                           -e MONGO_INITDB_ROOT_PASSWORD=example \
                           mongo 

#mongo-express
docker run -d --name=mongo-express -e ME_CONFIG_MONGODB_ADMINUSERNAME=root \
                                   -e ME_CONFIG_MONGODB_ADMINPASSWORD=example \
                                   -e ME_CONFIG_MONGODB_SERVER:mongo 
                                   --link=mongo -p 8090:8081
                                   mongo-express

# cleanup
docker rm -f mongo mongo-express