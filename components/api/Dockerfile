FROM alpine:3.3
MAINTAINER Ivan Pedrazas <ipedrazas@gmail.com>

RUN apk add --update \
      python \
      py-pip \
      jq \
      curl \
      bash \
       && \
      pip install flask Flask-PyMongo python-slugify

COPY . /app


CMD [ "python", "/app/api.py" ]
