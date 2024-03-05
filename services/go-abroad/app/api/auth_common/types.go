package auth_common

import (
	"patrick.com/abroad/app/domain/user"
	"patrick.com/abroad/app/repository"
)

type AuthCommonHandler struct {
	Impl *repository.RepoImpl
}

type MatchReq struct {
	SchoolName         string                    `json:"school_name"`
	SchoolType         int                       `json:"school_type"`
	Major              string                    `json:"major"`
	GPA                float64                   `json:"gpa"`
	LanguageAchi       user.AcademicExperience   `json:"language_achi"`
	AcademicExperience []user.AcademicExperience `json:"academic_experience"`
	IntentRegion       string                    `json:"intent_region"`
	Region             string                    `json:"region"`
	Degree             int                       `json:"degree"`
	IntentMajor        string                    `json:"intent_major"`
	OtherDetails       string                    `json:"other_details"`
	TOEFL              float64                   `json:"toefl"`
	IELTS              float64                   `json:"ielts"`
	GMAT               int                       `json:"gmat"`
	GRE                int                       `json:"gre"`
	SAT                int                       `json:"sat"`
	ACT                int                       `json:"act"`
	AP                 int                       `json:"ap"`
	ALevel             int                       `json:"a_level"`
	IB                 int                       `json:"ib"`
}

type Option struct {
	Value int    `json:"value"`
	Label string `json:"label"`
}

type SchoolTypeOption struct {
	Value  int    `json:"value"`
	Label  string `json:"label"`
	Degree int    `json:"degree"`
}
