FROM nginx:1.9.14-alpine

RUN apk add --update \
      jq \
      curl \
      bash

COPY app /usr/share/nginx/html
COPY proxy.conf  /etc/nginx/conf.d/proxy.conf

COPY run.sh /run.sh
RUN chmod +x /run.sh

CMD ["/run.sh"]



