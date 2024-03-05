package app

import (
	"database/sql"

	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/mysqldialect"
	"github.com/uptrace/bun/extra/bundebug"
	"patrick.com/abroad/app/domain/role_permission"

	_ "github.com/go-sql-driver/mysql"
)

func NewBunormDB(sqldb *sql.DB) (*bun.DB, error) {
	db := bun.NewDB(sqldb, mysqldialect.New())

	db.AddQueryHook(bundebug.NewQueryHook(
		bundebug.WithEnabled(false),

		// BUNDEBUG=1 logs failed queries
		// BUNDEBUG=2 logs all queries
		bundebug.FromEnv("BUNDEBUG"),
	))
	db.RegisterModel((*role_permission.RolePermission)(nil))

	return db, nil
}
