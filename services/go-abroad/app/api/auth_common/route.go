package auth_common

import (
	"github.com/uptrace/bunrouter"
	"patrick.com/abroad/app/logger"
	"patrick.com/abroad/app/repository"
)

func Init(group *bunrouter.Group, impl *repository.RepoImpl) {
	authCommonHandler := &AuthCommonHandler{
		Impl: impl,
	}
	logger.Info("init auth common route")

	group.POST("/match", authCommonHandler.match)
	group.GET("/getOptions", authCommonHandler.getOptions)
}
