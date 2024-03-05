package application

import (
	"time"

	"patrick.com/abroad/app/domain/file"
)

type Application struct {
	// bun.BaseModel `bun:"applications"`

	ApplicationId int          `bun:"application_id,pk" json:"application_id"`
	UserId        int          `bun:"user_id" json:"user_id"`
	School        string       `bun:"school" json:"school"`
	Major         string       `bun:"major" json:"major"`
	DDL           time.Time    `bun:"ddl" json:"ddl"`
	Status        StatusEnum   `bun:"status" json:"status"`
	Type          string       `bun:"type" json:"type"`
	Files         []*file.File `bun:"-" json:"files"`
	// Files         []*file.File `bun:"rel:has-many,join:application_id=application_id" json:"files"`
}

type ApplicationQuery struct {
	ApplicationId *int
	UserId        *int
	School        string
	Major         string
	Status        StatusEnum
	Type          string
}

type StatusEnum int

const (
	PrepareDocument   StatusEnum = 1
	PrepareDDL        StatusEnum = 2
	PrepareSubmit     StatusEnum = 3
	SubmitFee         StatusEnum = 4
	SubmitRefLetter   StatusEnum = 5
	OfferWaiting      StatusEnum = 6
	AdmissionDocument StatusEnum = 7
	AdmissionDeposit  StatusEnum = 8
	Done              StatusEnum = 9
)
