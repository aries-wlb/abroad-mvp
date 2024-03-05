package user

import (
	"patrick.com/abroad/app/domain/user"
)

func generateUserResp(user *user.User) *UserResp {
	return &UserResp{
		Account:              user.Account,
		AccountName:          user.AccountName,
		PhoneNumber:          user.PhoneNumber,
		RoleId:               user.RoleId,
		UserId:               user.UserId,
		GPA:                  user.GPA,
		Degree:               user.Degree,
		SchoolName:           user.SchoolName,
		SchoolType:           user.SchoolType,
		Major:                user.Major,
		LanguageAchi:         user.LanguageAchi,
		AcademicExperience:   user.AcademicExperience,
		LanguageScore:        user.LanguageAchi.Achievement,
		LanguageType:         user.LanguageAchi.Name,
		IntentRegion:         user.IntentRegion,
		IntentMajor:          user.IntentMajor,
		OtherDetails:         user.OtherDetails,
		UserName:             user.UserName,
		AvatarUrl:            user.AvatarUrl,
		Gender:               user.Gender,
		Location:             user.Location,
		WechatID:             user.WechatID,
		Email:                user.Email,
		PersonalIntroduction: user.PersonalIntroduction,
		CreatedAt:            user.CreatedAt,
		LastLogin:            user.LastLogin,
	}
}
