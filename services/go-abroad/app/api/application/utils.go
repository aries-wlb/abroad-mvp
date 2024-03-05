package application

import (
	"strconv"

	"github.com/uptrace/bunrouter"
	"patrick.com/abroad/app/domain/application"
)

func generateAppResp(applications []*application.Application) []*AppResp {
	var resp = make([]*AppResp, 0)
	for _, app := range applications {
		// if len(app.Files) == 0 {
		// 	app.Files = []*file.File{}
		// }
		resp = append(resp, &AppResp{
			ApplicationId: app.ApplicationId,
			UserId:        app.UserId,
			School:        app.School,
			Major:         app.Major,
			DDL:           app.DDL.Format("2006-01-02"),
			Status:        app.Status,
			Type:          app.Type,
			Files:         app.Files,
		})
	}

	return resp
}

func getApplicationQuery(req bunrouter.Request) (*application.ApplicationQuery, error) {
	query := req.URL.Query()
	var appId *int
	var userId *int
	var err error
	var status int
	if appStr := query.Get("application_id"); appStr != "" {
		var id int
		id, err = strconv.Atoi(appStr)
		appId = &id
	}

	if userStr := query.Get("user_id"); userStr != "" {
		var id int
		id, err = strconv.Atoi(userStr)
		userId = &id
	}

	if statusStr := query.Get("status"); statusStr != "" {
		status, err = strconv.Atoi(statusStr)
	}

	if err != nil {
		return nil, err
	}

	return &application.ApplicationQuery{
		ApplicationId: appId,
		UserId:        userId,
		School:        query.Get("school"),
		Major:         query.Get("major"),
		Status:        application.StatusEnum(status),
		Type:          query.Get("type"),
	}, nil
}
