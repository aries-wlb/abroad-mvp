package main

import (
	_ "github.com/joho/godotenv/autoload"
	"patrick.com/abroad/app"
)

func main() {
	webApp, _, _ := app.BuildApp()
	webApp.Run()
}
