package common

import "patrick.com/abroad/app/domain/user"

func generateUserResp(user *user.User) *UserResp {
	return &UserResp{
		Account:              user.Account,
		AccountName:          user.AccountName,
		PhoneNumber:          user.PhoneNumber,
		RoleId:               user.RoleId,
		UserId:               user.UserId,
		GPA:                  user.GPA,
		SchoolName:           user.SchoolName,
		SchoolType:           user.SchoolType,
		Major:                user.Major,
		LanguageAchi:         user.LanguageAchi,
		LanguageScore:        user.LanguageAchi.Achievement,
		LanguageType:         user.LanguageAchi.Name,
		AcademicExperience:   user.AcademicExperience,
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
