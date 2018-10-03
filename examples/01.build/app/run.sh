docker build -f 00.Simple.Dockerfile -t yshay/hello-color .
docker build -f 01.Cache.Dockerfile -t yshay/hello-color .
docker build -f 02.UnitTests.Dockerfile -t yshay/hello-color .
docker build -f 03.Multistage.Dockerfile -t yshay/hello-color .
docker build -t yshay/hello-color .
docker run -p --rm 3000:3000 yshay/hello-color:latest