build:
	@go build -o bin/sumbank

run: build
	@./bin/sumbank

test:
	@go test -v ./...

seed:
	@./bin/sumbank --seed

db-up:
	@docker-compose up -d

db-down:
	@docker-compose down