package common

import (
	"github.com/uptrace/bunrouter"
	"patrick.com/abroad/app/logger"
	"patrick.com/abroad/app/repository"
)

func Init(group *bunrouter.Group, impl *repository.RepoImpl) {
	common_handler := &CommonHandler{
		Impl: impl,
	}
	logger.Info("init common route")

	group.POST("/login", common_handler.login)
	group.POST("/register", common_handler.createUser)
	group.POST("/checkAccount", common_handler.checkAccount)
	group.GET("/articles", common_handler.getAritical)
}
