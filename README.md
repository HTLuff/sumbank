# SUM

<img src="logo.png" alt="Logo" width="200" height="200">

[![Go](https://img.shields.io/badge/go-1.16-blue.svg)](https://golang.org/)
[![Makefile](https://img.shields.io/badge/Makefile-green.svg)](Makefile)
[![Docker](https://img.shields.io/badge/Docker-blue.svg)](https://www.docker.com/)

## Table of Contents

- [About](#about)
- [Example](#example)
- [Usage](#usage)
- [Roadmap](#usage)

## About

JSON banking API project in Golang with JWT authentication, Postgresql, and Docker.

| Methods | Endpoint  | Input | Output |
| --- | --- | --- | --- |
| POST | `/login` | `Number: integer, Password: string` | `Token: string, Number: integer` |
| POST | `/transfer` | `` | `` |
| POST | `/account` | `FirstName: string, LastName: string, Password: string` | `` |
| GET | `/account` | `` | [`ID: number, FirstName: string, LastName: string, Number: string, EncryptedPassword: string, Balance: integer, CreatedAt: string`] |
| GET | `/account/{accountNumber}` | `` | `ID: number, FirstName: string, LastName: string, Number: string, EncryptedPassword: string, Balance: integer, CreatedAt: string` |
| DELETE | `/account/{accountNumber}` | `` | `Deleted: {id}` |

### Third Party Packages

- gorilla/mux: a powerful and flexible HTTP router and dispatcher. Used to extract variables from the request (e.g., query parameters, form values) easily, making it straightforward to handle user input and build dynamic responses.
- golang-jwt: JSON Web Tokens, commonly used for Bearer tokens in Oauth 2. jwt-go provides a flexible and extensible way to handle claims in JWTs. Claims represent pieces of information about the entity (user, client) that the token identifies, as well as Token Expiration and Validation and Verification.
- godotenv: load environment variables from a file, typically named `.env`.
- PQ: a pure Go Postgres driver for the database/sql package.
- bCrypt: implements Provos and Mazières's bcrypt adaptive hashing algorithm.
- testify/asset: provides a set of comprehensive testing tools for use with the normal Go testing system.

## Example

TBD

## Usage

1. Clone Repo
2. Create .env file with values for: [POSTGRES_PASSWORD, POSTGRES_USER, POSTGRES_NAME, JWT_SECRET]
3. Run `make` to create bin folder
4. Run `make db-up` to start a PostgreSQL container with the specified configuration in `./docker-compose.yml`
5. Run `make run` to run on port: 3000
6. Run `make seed` to seed the database with initial account data
7. POST request in Postman or Thunderclient to `http://localhost:3000/[endpoint]`
    a. Sample endpoints: ["/login", ]
8. Run tests by running `make test`
9. When finished, stop and remove the containers by running `make db-down`

## Roadmap

- [ ] Update endpoint table in README
- [ ] Add example to README
- [ ] Complete `/transfer` endpoint allowing balance movements between accounts
