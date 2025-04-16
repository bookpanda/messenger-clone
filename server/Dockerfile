FROM golang:1.23.8-alpine3.21 AS builder
WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . ./
RUN go build -o server cmd/main.go

FROM alpine AS runner
WORKDIR /app

COPY --from=builder /app/server ./
ENV GO_ENV production

EXPOSE 3000

CMD ["./server"]
