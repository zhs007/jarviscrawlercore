docker rm jarviscrawlercore
# docker run --name jarviscrawlercore -v $PWD/output:/usr/src/app/output jarviscrawlercore node ./bin/jarviscrawler.js exparticle http://www.baijingapp.com/article/22008 -p ./output/abc.pdf -f A4
# docker run --name jarviscrawlercore -v $PWD/output:/usr/src/app/output jarviscrawlercore node ./bin/jarviscrawler.js exparticle https://www.geekpark.net/news/239481 -p ./output/abc.pdf -f A4
docker run --name jarviscrawlercore -v $PWD/output:/usr/src/app/output jarviscrawlercore node ./bin/jarviscrawler.js exparticle https://36kr.com/p/5187453.html -o ./output/abc.pdf -m pdf -h true -q true
