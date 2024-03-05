package application

import (
	"net/http"
	"time"

	"github.com/google/wire"
	"github.com/uptrace/bunrouter"
	"patrick.com/abroad/app/constants"
	applicationDomain "patrick.com/abroad/app/domain/application"
	"patrick.com/abroad/app/domain/file"
	"patrick.com/abroad/app/pkg/ctx_helper"
	"patrick.com/abroad/app/utils"
)

var ApplicationSet = wire.NewSet(wire.Struct(new(ApplicationHandler), "*"))

func (a *ApplicationHandler) getApplicationByUser(w http.ResponseWriter, req bunrouter.Request) error {
	ctx := req.Context()
	userInfo := ctx_helper.GetUserInfo(ctx)

	applications, err := a.ApplicationImpl.GetByUserId(userInfo.Id)

	if err != nil {
		return err
	}

	return utils.GenSuccessResp(w, map[string]interface{}{
		"applications": generateAppResp(applications),
	})
}

func (a *ApplicationHandler) getApplication(w http.ResponseWriter, req bunrouter.Request) error {
	current, pageSize, err := utils.GetPaginationParams(req)

	if err != nil {
		return err
	}

	appQuery, err := getApplicationQuery(req)

	if err != nil {
		return err
	}

	applications, err := a.ApplicationImpl.FindByParam(appQuery)

	if err != nil {
		return err
	}

	return utils.GenPaginationResp(w, utils.Pagination{List: generateAppResp(applications), Current: current, PageSize: pageSize})
}

func (a *ApplicationHandler) createApplication(w http.ResponseWriter, req bunrouter.Request) error {
	var createReq CreateApplicationReq
	err := utils.DecodeJSONBody(w, req, &createReq)
	if err != nil {
		return err
	}

	ctx := req.Context()
	userInfo := ctx_helper.GetUserInfo(ctx)

	count, errCount := a.ApplicationImpl.CountByUserId(userInfo.Id)
	if errCount != nil {
		return errCount
	}
	if count >= 5 {
		return utils.GenFailedResp(w, "You can only create up to 5 applications", constants.ERROR_ADD_FAIL)
	}

	files := make([]*file.File, len(createReq.FileIds))
	for i, docID := range createReq.FileIds {
		files[i] = &file.File{
			FileId: docID,
			UserId: userInfo.Id,
		}
	}

	application := &applicationDomain.Application{
		UserId: userInfo.Id,
		School: createReq.School,
		Major:  createReq.Major,
		DDL:    time.Unix(createReq.DDL, 0),
		Files:  files,
		Type:   createReq.Type,
		Status: applicationDomain.PrepareDocument,
	}

	err = a.ApplicationImpl.Create(application)

	if err != nil {
		return err
	}

	return utils.GenSuccessResp(w, map[string]interface{}{})
}

func (a *ApplicationHandler) deleteByUser(w http.ResponseWriter, req bunrouter.Request) error {
	ctx := req.Context()
	userInfo := ctx_helper.GetUserInfo(ctx)

	var param ApplicationDeleteReq
	err := utils.DecodeJSONBody(w, req, &param)
	if err != nil {
		return err
	}

	exist, err2 := a.ApplicationImpl.CheckExist(param.ApplicationId, &userInfo.Id)

	if err2 != nil {
		return err2
	}
	if !exist {
		return utils.GenNotExistResp(w)
	}

	err3 := a.ApplicationImpl.DeleteById(param.ApplicationId)

	if err3 != nil {
		return err3
	}

	return utils.GenSuccessResp(w, map[string]interface{}{})
}

func (a *ApplicationHandler) updateByUser(w http.ResponseWriter, req bunrouter.Request) error {
	var param UpdateApplicationReq
	err := utils.DecodeJSONBody(w, req, &param)
	if err != nil {
		return err
	}

	ctx := req.Context()
	userInfo := ctx_helper.GetUserInfo(ctx)

	files := make([]*file.File, len(param.FileIds))
	for i, docID := range param.FileIds {
		files[i] = &file.File{
			FileId: docID,
			UserId: userInfo.Id,
		}
	}

	application, err := a.ApplicationImpl.GetById(param.ApplicationId)
	if application.UserId != userInfo.Id {
		return utils.GenFailedResp(w, "Error Update Application", constants.ERROR_EDIT_FAIL)
	}
	if err != nil {
		return err
	}

	application.School = param.School
	application.Major = param.Major
	application.DDL = time.Unix(param.DDL, 0)
	application.Files = files

	err = a.ApplicationImpl.Update(application)
	if err != nil {
		return err
	}

	return utils.GenSuccessResp(w, map[string]interface{}{})
}

func (a *ApplicationHandler) updateStatusByUser(w http.ResponseWriter, req bunrouter.Request) error {
	var param UpdateStatusReq
	err := utils.DecodeJSONBody(w, req, &param)
	ctx := req.Context()
	userInfo := ctx_helper.GetUserInfo(ctx)
	if err != nil {
		return err
	}

	application, err := a.ApplicationImpl.GetById(param.ApplicationId)

	if err != nil {
		return err
	}

	if application.UserId != userInfo.Id {
		return utils.GenFailedResp(w, "Error Update Application", constants.ERROR_EDIT_FAIL)
	}

	application.Status = param.Status

	err = a.ApplicationImpl.UpdateStatus(application)
	if err != nil {
		return err
	}

	return utils.GenSuccessResp(w, map[string]interface{}{})
}

func (a *ApplicationHandler) create(w http.ResponseWriter, req bunrouter.Request) error {
	var createReq CreateApplicationReq
	err := utils.DecodeJSONBody(w, req, &createReq)
	if err != nil {
		return err
	}

	count, errCount := a.ApplicationImpl.CountByUserId(createReq.UserId)
	if errCount != nil {
		return errCount
	}
	if count >= 5 {
		return utils.GenFailedResp(w, "You can only create up to 5 applications for each member", constants.ERROR_ADD_FAIL)
	}

	files := make([]*file.File, len(createReq.FileIds))
	for i, docID := range createReq.FileIds {
		files[i] = &file.File{
			FileId: docID,
			UserId: createReq.UserId,
		}
	}

	application := &applicationDomain.Application{
		UserId: createReq.UserId,
		School: createReq.School,
		Major:  createReq.Major,
		DDL:    time.Unix(createReq.DDL, 0),
		Files:  files,
		Type:   createReq.Type,
		Status: createReq.Status,
	}

	err = a.ApplicationImpl.Create(application)

	if err != nil {
		return err
	}

	return utils.GenSuccessResp(w, map[string]interface{}{})
}

func (a *ApplicationHandler) delete(w http.ResponseWriter, req bunrouter.Request) error {

	var param ApplicationDeleteReq
	err := utils.DecodeJSONBody(w, req, &param)
	if err != nil {
		return err
	}

	exist, err2 := a.ApplicationImpl.CheckExist(param.ApplicationId, nil)

	if err2 != nil {
		return err2
	}
	if !exist {
		return utils.GenNotExistResp(w)
	}

	err3 := a.ApplicationImpl.DeleteById(param.ApplicationId)

	if err3 != nil {
		return err3
	}

	return utils.GenSuccessResp(w, map[string]interface{}{})
}

func (a *ApplicationHandler) update(w http.ResponseWriter, req bunrouter.Request) error {
	var param UpdateApplicationReq
	err := utils.DecodeJSONBody(w, req, &param)
	if err != nil {
		return err
	}

	files := make([]*file.File, len(param.FileIds))
	for i, docID := range param.FileIds {
		files[i] = &file.File{
			FileId: docID,
			UserId: param.UserId,
		}
	}

	application, err := a.ApplicationImpl.GetById(param.ApplicationId)

	if err != nil {
		return err
	}

	application.School = param.School
	application.Major = param.Major
	application.Type = param.Type
	application.DDL = time.Unix(param.DDL, 0)
	application.Files = files
	application.UserId = param.UserId
	application.Status = param.Status

	err = a.ApplicationImpl.Update(application)
	if err != nil {
		return err
	}

	return utils.GenSuccessResp(w, map[string]interface{}{})
}
