FROM node:14-alpine3.12 AS development

WORKDIR /app

ADD package.json package-lock.json /app/
RUN npm install

ADD . /app
RUN npm run build reward
RUN npm run build admin
RUN npm run build missions

RUN npm install --only=prod

FROM node:14-alpine3.12 AS production

EXPOSE 3000

WORKDIR /app

RUN GRPC_HEALTH_PROBE_VERSION=v0.3.1 && \
    wget -qO/bin/grpc_health_probe https://github.com/grpc-ecosystem/grpc-health-probe/releases/download/${GRPC_HEALTH_PROBE_VERSION}/grpc_health_probe-linux-amd64 && \
    chmod +x /bin/grpc_health_probe

COPY --from=builder /app .
