package application

import (
	"github.com/google/wire"
	"patrick.com/abroad/app/logger"
	"patrick.com/abroad/app/repository/file"
)

var ApplicationImplSet = wire.NewSet(wire.Struct(new(ApplicationRepoImpl), "*"))

type ApplicationRepoImpl struct {
	ApplicationRepo ApplicationRepository
	FileRepo        file.FileRepository
}

func (ap *ApplicationRepoImpl) GetById(applicationId int) (*Application, error) {
	return ap.ApplicationRepo.FindById(applicationId)
}

func (ap *ApplicationRepoImpl) DeleteById(applicationId int) error {
	return ap.ApplicationRepo.DeleteById(applicationId)
}

func (ap *ApplicationRepoImpl) FindByParam(param *ApplicationQuery) ([]*Application, error) {
	app, err := ap.ApplicationRepo.FindByParam(param)
	for i := range app {
		files, err := ap.FileRepo.FindByAppId(app[i].ApplicationId)
		if err != nil {
			logger.Error("获取文件失败", err, "id", app[i].ApplicationId)
			app[i].Files = make([]*file.File, 0)
			continue
		}
		app[i].Files = files
	}

	return app, err
}

func (ap *ApplicationRepoImpl) CheckExist(applicationId int, userId *int) (bool, error) {
	application := &Application{
		ApplicationId: applicationId,
	}

	if userId != nil {
		application.UserId = *userId
	}
	return ap.ApplicationRepo.CheckExist(application)
}

func (ap *ApplicationRepoImpl) GetByUserId(userId int) ([]*Application, error) {
	app, err := ap.ApplicationRepo.FindByUserId(userId)
	for i := range app {
		files, err := ap.FileRepo.FindByAppId(app[i].ApplicationId)
		if err != nil {
			logger.Error("获取文件失败", err, "id", app[i].ApplicationId)
			app[i].Files = make([]*file.File, 0)
			continue
		}
		app[i].Files = files
	}

	return app, err
}

func (ap *ApplicationRepoImpl) Create(application *Application) error {
	res, err := ap.ApplicationRepo.Create(application)
	if err != nil {
		return err
	}
	files := application.Files
	appId, err := res.LastInsertId()
	if err != nil {
		logger.Error("获取应用id失败", err)
	}
	for i := range files {
		appIdInt := int(appId)
		files[i].ApplicationId = &appIdInt
	}
	err = ap.FileRepo.BulkUpdate(files, "application_id", false)
	if err != nil {
		logger.Error("批量更新文件失败", err)
	}
	return nil
}

func (ap *ApplicationRepoImpl) Update(app *Application) error {
	err := ap.ApplicationRepo.Update(app)
	if err != nil {
		return err
	}
	files := app.Files
	appId := app.ApplicationId
	filesForApp, err := ap.FileRepo.FindByAppId(appId)
	if err != nil {
		logger.Error("获取应用id失败", err)
	}

	for i := range filesForApp {
		filesForApp[i].ApplicationId = nil
	}

	for i := range files {
		files[i].ApplicationId = &appId
	}

	files = append(files, filesForApp...)

	err = ap.FileRepo.BulkUpdate(files, "application_id", true)
	if err != nil {
		logger.Error("批量更新文件失败", err)
	}
	return nil
}

func (ap *ApplicationRepoImpl) UpdateStatus(a *Application) error {
	return ap.ApplicationRepo.UpdateCol("status", a)
}

func (ap *ApplicationRepoImpl) CountByUserId(id int) (int, error) {
	return ap.ApplicationRepo.CountByUserId(id)
}
