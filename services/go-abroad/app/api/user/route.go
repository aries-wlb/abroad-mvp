package user

import (
	"github.com/uptrace/bunrouter"
	"patrick.com/abroad/app/logger"
	"patrick.com/abroad/app/repository/user"
)

func Init(group *bunrouter.Group, ud user.UserRepoImpl) {
	userHandler := &UserHandler{
		UserImpl: ud,
	}
	logger.Info("init user route")

	userGroup := group.NewGroup("/user")

	userGroup.GET("/info", userHandler.getUser)
	userGroup.POST("/update", userHandler.updateUser)
}
