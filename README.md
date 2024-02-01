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

| Endpoint  | Input | Output |
| --- | --- | --- |
| `/login` | `{}` | `{id: string}` |

## Example

TBD

## Usage

1. Clone Repo
2. Run `make` to create bin folder
3. Open Docker and create postgreSQL table
4. Run `make run` to run on port: 3000
5. Run `make seed` to seed the database with initial account data
6. POST request in Postman or Thunderclient to `http://localhost:3000/[endpoint]`
    a. Sample endpoints: ["/login", ]
7. Run tests by running `make test`

To delete docker containers:

1. `docker ps`
2. `docker stop {name}`

## Roadmap

- [ ] Update endpoint table in README
- [ ] Add example to README
