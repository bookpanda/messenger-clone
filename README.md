# messenger-clone

trying to recreate Facebook Messenger.

## Prerequisites

Download these tools before you start working on the project.

- pnpm 9.5.0 or later
- Prettier VSCode extension (also set format on save)
- golang 1.23 or [later](https://go.dev)
- makefile
- Docker
- [Go Air](https://github.com/air-verse/air)
- swag v2 (`go install github.com/swaggo/swag/v2/cmd/swag@v2.0.0-rc4`)

# Frontend (./client)

## Stack

- typescript
- nextjs
- tailwindcss
- websocket

## Setup

1. Run `pnpm install`
2. Copy `.env.template` file in root of the project as `.env` into the root of the project fill in the values
3. Run `pnpm dev` to start the server

# Backend (./server)

## Stack

- golang
- PostgreSQL
- Redis
- websocket

## Setup

1. Run `go mod download` to download all the dependencies.
2. Copy `.env.template` file in root of the project as `.env` into the root of the project fill in the values
3. Run `docker-compose up -d && air` or `make dev` to start the server

## Seeding
1. Run `make seed` to seed the database with some data.

## Tips
1. If redis is deleted, don't forget to also delete cookies in chrome (next-auth stores the tokens in cookies, it'd be invalidated if redis is deleted)
2. If backend is rerun e.g. from code changes, refresh the browser to reconnect websockets