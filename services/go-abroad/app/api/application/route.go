package application

import (
	"github.com/uptrace/bunrouter"
	"patrick.com/abroad/app/logger"
	"patrick.com/abroad/app/repository/application"
)

func Init(group *bunrouter.Group, ai application.ApplicationRepoImpl) {
	applicationHandler := &ApplicationHandler{
		ApplicationImpl: ai,
	}
	logger.Info("init application route")

	userGroup := group.NewGroup("/application")

	userGroup.GET("/getApplication", applicationHandler.getApplication)
	userGroup.GET("/getByUser", applicationHandler.getApplicationByUser)
	userGroup.POST("/createByUser", applicationHandler.createApplication)
	userGroup.POST("/deleteByUser", applicationHandler.deleteByUser)
	userGroup.POST("/updateByUser", applicationHandler.updateByUser)
	userGroup.POST("/updateStatusByUser", applicationHandler.updateStatusByUser)

	userGroup.POST("/create", applicationHandler.create)
	userGroup.POST("/delete", applicationHandler.delete)
	userGroup.POST("/update", applicationHandler.update)
}
