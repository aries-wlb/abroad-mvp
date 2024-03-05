package repository

import (
	"github.com/google/wire"
	"patrick.com/abroad/app/repository/application"
	"patrick.com/abroad/app/repository/article"
	"patrick.com/abroad/app/repository/file"
	"patrick.com/abroad/app/repository/permission"
	"patrick.com/abroad/app/repository/role"
	"patrick.com/abroad/app/repository/role_permission"
	"patrick.com/abroad/app/repository/user"
)

type RepoImpl struct {
	UserRepoImpl    user.UserRepoImpl
	RoleImpl        role.RoleRepoImpl
	FileImpl        file.FileRepoImpl
	ApplicationImpl application.ApplicationRepoImpl
	ArticleImpl     article.ArticleImpl
}

type Repo struct {
	UserRepo           user.UserRepository
	RoleRepo           role.RoleRepository
	PermissionRepo     permission.PermissionRepository
	RolePermissionRepo role_permission.RolePermssionRepository
	ApplicationRepo    application.ApplicationRepository
	FileRepo           file.FileRepository
	ArticleRepo        article.ArticleRepository
}

var RepositorySet = wire.NewSet(
	user.UserSet,
	role.RoleSet,
	permission.PermissionSet,
	role_permission.RolePermssionSet,
	application.ApplicationSet,
	file.FileSet,
	article.ArticleSet,
	wire.Struct(new(Repo), "*"),
)

var ImplSet = wire.NewSet(
	user.UserImplSet,
	role.RoleImplSet,
	file.FileImplSet,
	application.ApplicationImplSet,
	article.ArticleImplSet,
	wire.Struct(new(RepoImpl), "*"),
)

// func AutoMigrate(db *bun.DB) {
// 	tables := []interface{}{
// 		new(User),
// 	}
// 	for _, v := range tables {
// 		db.AutoMigrate(v)
// 	}
// }
