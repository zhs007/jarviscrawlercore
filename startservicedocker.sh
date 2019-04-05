docker stop jarviscrawlerserv
docker rm jarviscrawlerserv
docker run -d -v $PWD/cfg:/usr/src/app/cfg --name jarviscrawlerserv -p 7051:7051 jarviscrawlercore