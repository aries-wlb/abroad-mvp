package admin

import (
	"patrick.com/abroad/app/domain/application"
	"patrick.com/abroad/app/domain/user"
	"patrick.com/abroad/app/repository"
)

type AdminHandler struct {
	Impl *repository.RepoImpl
}

type UserUpdateReq struct {
	UserId               int                       `json:"user_id"`
	AccountName          string                    `json:"account_name"`
	UserName             string                    `json:"user_name"`
	Email                string                    `json:"email"`
	PhoneNumber          string                    `json:"phone_number"`
	WechatID             string                    `json:"wechat_id"`
	Location             string                    `json:"location"`
	SchoolName           string                    `json:"school_name"`
	Degree               int                       `json:"degree"`
	SchoolType           int                       `json:"school_type"`
	Major                string                    `json:"major"`
	GPA                  float64                   `json:"gpa"`
	LanguageAchi         user.AcademicExperience   `json:"language_achi"`
	AcademicExperience   []user.AcademicExperience `json:"academic_experience"`
	IntentRegion         string                    `json:"intent_region"`
	IntentMajor          string                    `json:"intent_major"`
	OtherDetails         string                    `json:"other_details"`
	PersonalIntroduction string                    `json:"personal_introduction"`
	Gender               string                    `json:"gender"`
	RoleId               int                       `json:"role_id"`
}

type ArticleUpdateReq struct {
	ArticleId  int    `json:"article_id"`
	Title      string `json:"title"`
	ArticleUrl string `json:"article_url"`
	Content    string `json:"content"`
	Author     string `json:"author"`
}

type ArticleDeleteReq struct {
	ArticleId int `json:"article_id"`
}

type UserResp struct {
	Account              string                    `json:"account"`
	AccountName          string                    `json:"account_name"`
	PhoneNumber          string                    `json:"phone_number"`
	RoleId               int                       `json:"role_id"`
	UserId               int                       `json:"user_id"`
	GPA                  float64                   `json:"gpa"`
	SchoolName           string                    `json:"school_name"`
	Degree               int                       `json:"degree"`
	SchoolType           int                       `json:"school_type"`
	Major                string                    `json:"major"`
	LanguageAchi         user.AcademicExperience   `json:"language_achi"`
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
	CreatedAt            int64                     `json:"created_at"`
	LastLogin            int64                     `json:"last_login"`
}

type StudentResp struct {
	UserResp
	Applications []*application.Application `json:"applications"`
}
