#!/bin/sh

# Preprend the upstream configuration
(echo "upstream apiservice { server $API_ADDR:$API_PORT; }" && cat /etc/nginx/conf.d/proxy.conf) > proxy.conf.new


mv proxy.conf.new /etc/nginx/conf.d/default.conf

# Log the resulting configuration file
cat /etc/nginx/conf.d/default.conf


nginx -g "daemon off;"
