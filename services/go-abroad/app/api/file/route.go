package file

import (
	"github.com/uptrace/bunrouter"
	"patrick.com/abroad/app/logger"
	"patrick.com/abroad/app/repository/file"
)

func Init(group *bunrouter.Group, fi file.FileRepoImpl) {
	fileHandler := &FileHandler{
		FileImpl: fi,
	}
	logger.Info("init file route")

	fileGroup := group.NewGroup("/file")

	fileGroup.POST("/upload", fileHandler.uploadFileHandler)

}
