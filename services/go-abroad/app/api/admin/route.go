package admin

import (
	"github.com/uptrace/bunrouter"
	"patrick.com/abroad/app/logger"
	"patrick.com/abroad/app/repository"
)

func Init(group *bunrouter.Group, impl *repository.RepoImpl) {
	adminHandler := &AdminHandler{
		Impl: impl,
	}
	logger.Info("init admin route")

	userGroup := group.NewGroup("/admin")

	userGroup.GET("/getUsers", adminHandler.getUserByRole)
	userGroup.GET("/getStudents", adminHandler.getStudents)
	userGroup.POST("/updateUser", adminHandler.updateUser)
	userGroup.POST("/updateArticle", adminHandler.updateArticle)
	userGroup.POST("/addArticle", adminHandler.addArticle)
	userGroup.POST("/deleteArticle", adminHandler.deleteArticle)
}
