# SUM

<img src="logo.png" alt="Logo" width="200" height="200">

[![Go](https://img.shields.io/badge/go-1.16-blue.svg)](https://golang.org/)
[![Makefile](https://img.shields.io/badge/Makefile-Yes-green.svg)](Makefile)

## Table of Contents

- [About](#about)
- [Example](#example)
- [Usage](#usage)
- [Roadmap](#usage)

## About

JSON banking API project in Golang with JWT authentication, Postgresql, and Docker.

| Methods | Endpoint  | Input | Output |
| --- | --- | --- | --- |
| POST | `/login` | `{}` | `{id: string}` |
| GET | `/account/{accountNumber}` | | "first_name": "", "last_name": "" |
| POST | `/transfer` | | |

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
