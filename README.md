![hero image](https://github.com/HTLuff/sumbank/blob/main/hero.png)


# Sum Bank

JSON banking API project in Golang with JWT authentication, Postgresql, and Docker.

## Getting Started

1. Clone Repo
2. Run `make` to create bin folder
3. Run `make run` to run on port: 3000
4. Run `./bin/sumbank --seed` to seed the database with initial account data
5. POST request in Postman or Thunderclient to `http://localhost:3000/[endpoint]`
    a. Sample endpoints: ["/login", ]
6. Run tests by running `make test`

## Docker

[Docker postgres instance](https://hub.docker.com/_/postgres)

To delete docker containers:

1. `docker ps`
2. `docker stop {name}`
