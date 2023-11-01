build:
	@go build -o bin/sumbank

run: build
	@./bin/sumbank

test:
	@go test -v ./...