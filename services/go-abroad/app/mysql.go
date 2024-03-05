package app

import (
	"database/sql"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"patrick.com/abroad/app/logger"
)

func NewMysqlDB() *sql.DB {
	dsn := os.Getenv("app_mysql_dsn")

	logger.Info("msyql dsn: ", dsn)

	sqldb, err := sql.Open("mysql", dsn)
	if err != nil {
		panic(err)
	}

	// db := bun.NewDB(sqldb, mysqldialect.New())
	return sqldb
}
