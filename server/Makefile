server:
	go generate ./... && go run cmd/main.go

generate:
	go generate ./...

lint:
	golangci-lint run

start:
	docker-compose up -d && air

seed:
	go run cmd/main.go seed

.PHONY:
	server swagger start