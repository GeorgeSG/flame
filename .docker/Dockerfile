FROM node:16 as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN mkdir -p ./public ./data \
    && cd ./client \
    && npm install \
    && npm run build \
    && cd .. \
    && mv ./client/build/* ./public \
    && rm -rf ./client

FROM node:16-alpine

COPY --from=builder /app /app

WORKDIR /app

RUN chown -R node:node .

EXPOSE 5005

USER node

ENV NODE_ENV=production
ENV PASSWORD=flame_password

CMD ["node", "server.js"]
