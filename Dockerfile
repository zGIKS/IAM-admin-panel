FROM oven/bun:1.2-alpine

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

ARG APP_PORT
ENV APP_PORT=${APP_PORT}

EXPOSE ${APP_PORT}

CMD ["sh", "-c", "bun run dev --host 0.0.0.0 --port ${APP_PORT}"]
