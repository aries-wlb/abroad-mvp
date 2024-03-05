package user

import (
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/uptrace/bun"
	"patrick.com/abroad/app/domain/application"
)

type UserBase struct {
	Account     string
	AccountName string
	Password    string
	PhoneNumber string
	RoleId      int
}

type AcademicExperience struct {
	Name        string  `json:"name"`
	Achievement float64 `json:"achievement"`
}

type User struct {
	bun.BaseModel `bun:"table:users,alias:u"`

	UserBase
	UserId               int                  `bun:"user_id,pk,autoincrement"`
	GPA                  float64              `bun:"gpa"`
	SchoolName           string               `bun:"school_name"`
	SchoolType           int                  `bun:"school_type"`
	Degree               int                  `bun:"degree"`
	Major                string               `bun:"major"`
	LanguageAchi         AcademicExperience   `bun:"language_achi"`
	AcademicExperience   []AcademicExperience `bun:"academic_experience"`
	IntentRegion         string               `bun:"intent_region"`
	IntentMajor          string               `bun:"intent_major"`
	OtherDetails         string               `bun:"other_details"`
	UserName             string               `bun:"user_name"`
	AvatarUrl            string               `bun:"avatar_url"`
	Gender               string               `bun:"gender"`
	Location             string               `bun:"location"`
	WechatID             string               `bun:"wechat_id"`
	Email                string               `bun:"email"`
	PersonalIntroduction string               `bun:"personal_introduction"`
	CreatedAt            time.Time            `bun:",nullzero,notnull,default:current_timestamp"`
	LastLogin            time.Time            `bun:",nullzero,notnull,default:current_timestamp"`

	Applications []*application.Application `bun:"rel:has-many,join:user_id=user_id" json:"applications"`
}

type Claims struct {
	Account  string `json:"account"`
	Id       int    `json:"id"`
	Password string `json:"password"`
	jwt.StandardClaims
}

type RoleId int

const (
	RoleAdmin   RoleId = 1
	RoleStudent RoleId = 2
)
