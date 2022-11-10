FROM node:18.8.0 as builder
WORKDIR /opt/web

# build 命令，具体自定义自己的应用程序build步骤
COPY . ./
RUN yarn install
ENV REACT_APP_API_ENV=prod
RUN yarn docs;

# docker in docker 安装nginx镜像暴露80端口

FROM nginx:latest
RUN apt-get update && apt-get install awscli curl -y
RUN curl -L https://github.com/a8m/envsubst/releases/download/v1.1.0/envsubst-`uname -s`-`uname -m` -o envsubst && \
  chmod +x envsubst && \
  mv envsubst /usr/local/bin

COPY ./nginx.config /etc/nginx/nginx.template
ENV REACT_APP_API_ENV=prod
CMD ["/bin/sh", "-c", "envsubst < /etc/nginx/nginx.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]

# 将build后的产物移动到nginx
COPY --from=builder /opt/web/docs /usr/share/nginx/html