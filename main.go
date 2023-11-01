package main

import (
	"flag"
	"fmt"
	"log"

	"github.com/joho/godotenv"
)

func seedAccount(store Storage, fname, lname, pw string) *Account {
	acc, err := NewAccount(fname, lname, pw)
	if err != nil {
		log.Fatal(err)
	}
	if err := store.CreateAccount(acc); err != nil {
		log.Fatal(err)
	}
	fmt.Println("new account => ", acc.Number)
	return acc
}

func seedAccounts(s Storage) {
	seedAccount(s, "Harry", "Potter", "seed-test-password")
}

func main() {
	// account seeding boolean check
	seed := flag.Bool("seed", false, "seed account")
	flag.Parse()
	// Loading Env variables
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Error loading environment variables file")
	}
	// Initialise Postgres store
	store, err := NewPostgresStore()
	if err != nil {
		log.Fatal(err)
	}
	if err := store.Init(); err != nil {
		log.Fatal(err)
	}
	if *seed {
		fmt.Println("seeding the db with account")
		seedAccounts(store)
	}
	// Launch server combining address and store
	server := NewAPIServer(":3000", store)
	server.Run()
}
