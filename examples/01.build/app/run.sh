docker build -f 00.Simple.Dockerfile -t yshay/hello-color .
docker build -f 01.Cache.Dockerfile -t yshay/hello-color .
docker build -f 02.UnitTest.Dockerfile -t yshay/hello-color .
docker build -f 03.Multistage.Dockerfile -t yshay/hello-color:ms .
docker image ls | grep yshay/hello-color
docker build -t yshay/hello-color .
docker run --rm -p 3000:3000 yshay/hello-color:latest
