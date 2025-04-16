server:
	go generate ./... && go run cmd/main.go

generate:
	go generate ./...

lint:
	golangci-lint run

start:
	docker-compose up -d && air

seed: 
	go run cmd/main.go seed all

seed-messages:
	go run cmd/main.go seed messages

qa:
	docker-compose -f docker-compose.qa.yml up

.PHONY:
	server swagger start