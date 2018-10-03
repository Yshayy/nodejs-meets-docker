docker build -t yshayy/hello-color .
docker build -f 00.Simple.Dockerfile -t yshayy/hello-color .
docker build -f 01.Cache.Dockerfile -t yshayy/hello-color .
docker build -f 02.UnitTests.Dockerfile -t yshayy/hello-color .
docker build -f 03.Multistage.Dockerfile -t yshayy/hello-color .
docker run -p --rm 3000:3000 yshayy/hello-color:latest