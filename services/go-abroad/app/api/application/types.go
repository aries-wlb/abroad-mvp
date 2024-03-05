package application

import (
	applicationDomain "patrick.com/abroad/app/domain/application"
	"patrick.com/abroad/app/domain/file"
	applicationRepo "patrick.com/abroad/app/repository/application"
)

type ApplicationHandler struct {
	ApplicationImpl applicationRepo.ApplicationRepoImpl
}

type CreateApplicationReq struct {
	School  string                       `json:"school"`
	Major   string                       `json:"major"`
	DDL     int64                        `json:"ddl"`
	Type    string                       `json:"type"`
	FileIds []int                        `json:"file_ids"`
	UserId  int                          `json:"user_id,omitempty"`
	Status  applicationDomain.StatusEnum `json:"status,omitempty"`
}

type UpdateApplicationReq struct {
	ApplicationId int                          `json:"application_id"`
	School        string                       `json:"school"`
	Major         string                       `json:"major"`
	DDL           int64                        `json:"ddl"`
	FileIds       []int                        `json:"file_ids"`
	UserId        int                          `json:"user_id,omitempty"`
	Type          string                       `json:"type,omitempty"`
	Status        applicationDomain.StatusEnum `json:"status,omitempty"`
}

type UpdateStatusReq struct {
	ApplicationId int                          `json:"application_id"`
	Status        applicationDomain.StatusEnum `json:"status"`
}

type AppResp struct {
	ApplicationId int                          `json:"application_id"`
	UserId        int                          `json:"user_id"`
	School        string                       `json:"school"`
	Major         string                       `json:"major"`
	DDL           string                       `json:"ddl"`
	Status        applicationDomain.StatusEnum `json:"status"`
	Type          string                       `json:"type"`
	Files         []*file.File                 `json:"files"`
}

type ApplicationDeleteReq struct {
	ApplicationId int `json:"application_id"`
}
