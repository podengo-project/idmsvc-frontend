# https://catalog.redhat.com/software/containers/ubi9/nodejs-18/62e8e7ed22d1d3c2dfe2ca01
FROM registry.redhat.io/rhel9/nodejs-18:1-108.1714669798 AS builder
# https://github.com/cypress-io/cypress/issues/25236
# TODO Set env variable indicated into the URL
USER root
WORKDIR /opt/app-root/src
COPY package*.json .
RUN npm install
COPY src src
COPY *.js .
COPY tsconfig.json tsconfig.json
RUN npm run build

COPY build/package/gen.app.info.sh gen.app.info.sh
RUN mv dist target \
    && mkdir dist \
    && cp -Rvf target dist/preview \
    && cp -Rvf target dist/stable \
    && true
ARG SRC_HASH
ENV SRC_HASH=${SRC_HASH}
ARG APP_NAME
ENV APP_NAME=${APP_NAME}
RUN ./gen.app.info.sh


# https://quay.io/repository/cloudservices/caddy-ubi?tab=tags
FROM quay.io/cloudservices/caddy-ubi:11145b1
WORKDIR /opt/app-root/src

RUN mkdir -p /opt/app-root/src/dist/stable /opt/app-root/src/dist/preview
COPY build/package/Caddyfile /opt/app-root/src/Caddyfile
COPY --from=builder /opt/app-root/src/dist /opt/app-root/src/dist/
COPY --from=builder /opt/app-root/src/app.info.json /opt/app-root/src/dist/
COPY --from=builder /opt/app-root/src/app.info.deps.json /opt/app-root/src/dist/
COPY --from=builder /opt/app-root/src/app.info.stable.json /opt/app-root/src/dist/stable/app.info.json
COPY --from=builder /opt/app-root/src/app.info.preview.json /opt/app-root/src/dist/preview/app.info.json
COPY ./package.json /opt/app-root/src/

RUN sed -i -e 's/\/beta\/apps/\/apps/g' /opt/app-root/src/dist/stable/fed-mods.json

ENV APP_NAME="idmsvc"

CMD ["caddy", "run", "--config", "/opt/app-root/src/Caddyfile"]

EXPOSE 8000
EXPOSE 9000

ENV CADDY_TLS_MODE="http_port 8000"

