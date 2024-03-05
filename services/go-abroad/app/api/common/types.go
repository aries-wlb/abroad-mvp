package common

import (
	"time"

	"patrick.com/abroad/app/domain/user"
	"patrick.com/abroad/app/repository"
)

type CommonHandler struct {
	Impl *repository.RepoImpl
}

type LoginReq struct {
	Account  string `json:"account"`
	Password string `json:"password"`
}

type RegReq struct {
	PhoneNumber string `json:"phone_number"`
	AccountName string `json:"account_name"`
	Account     string `json:"account"`
	Password    string `json:"password"`
	RoleId      int    `json:"role_id"`
}

type CheckAccountReq struct {
	Account string `json:"account"`
}

type UserResp struct {
	Account              string                    `json:"account"`
	AccountName          string                    `json:"account_name"`
	PhoneNumber          string                    `json:"phone_number"`
	RoleId               int                       `json:"role_id"`
	UserId               int                       `json:"user_id"`
	GPA                  float64                   `json:"gpa"`
	SchoolName           string                    `json:"school_name"`
	SchoolType           int                       `json:"school_type"`
	Major                string                    `json:"major"`
	LanguageAchi         user.AcademicExperience   `json:"language_achi"`
	LanguageScore        float64                   `json:"language_score"`
	LanguageType         string                    `json:"language_type"`
	AcademicExperience   []user.AcademicExperience `json:"academic_experience"`
	IntentRegion         string                    `json:"intent_region"`
	IntentMajor          string                    `json:"intent_major"`
	OtherDetails         string                    `json:"other_details"`
	UserName             string                    `json:"user_name"`
	AvatarUrl            string                    `json:"avatar_url"`
	Gender               string                    `json:"gender"`
	Location             string                    `json:"location"`
	WechatID             string                    `json:"wechat_id"`
	Email                string                    `json:"email"`
	PersonalIntroduction string                    `json:"personal_introduction"`
	CreatedAt            time.Time                 `json:"created_at"`
	LastLogin            time.Time                 `json:"last_login"`
}
