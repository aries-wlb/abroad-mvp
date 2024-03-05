package admin

import (
	"patrick.com/abroad/app/domain/application"
	"patrick.com/abroad/app/domain/user"
)

func generateUsersResp(users []*user.User) []*UserResp {
	usersResp := make([]*UserResp, len(users))
	for i, u := range users {
		usersResp[i] = &UserResp{
			Account:              u.Account,
			AccountName:          u.AccountName,
			PhoneNumber:          u.PhoneNumber,
			RoleId:               u.RoleId,
			UserId:               u.UserId,
			GPA:                  u.GPA,
			SchoolName:           u.SchoolName,
			SchoolType:           u.SchoolType,
			Major:                u.Major,
			LanguageAchi:         u.LanguageAchi,
			AcademicExperience:   u.AcademicExperience,
			IntentRegion:         u.IntentRegion,
			IntentMajor:          u.IntentMajor,
			OtherDetails:         u.OtherDetails,
			UserName:             u.UserName,
			AvatarUrl:            u.AvatarUrl,
			Gender:               u.Gender,
			Location:             u.Location,
			Degree:               u.Degree,
			WechatID:             u.WechatID,
			Email:                u.Email,
			PersonalIntroduction: u.PersonalIntroduction,
			CreatedAt:            u.CreatedAt.Unix(),
			LastLogin:            u.LastLogin.Unix(),
		}
	}
	return usersResp
}

func generateStudentsResp(students []*user.User) []*StudentResp {
	studentResp := make([]*StudentResp, len(students))
	for i, s := range students {
		if len(s.Applications) == 0 {
			s.Applications = []*application.Application{}
		}
		studentResp[i] = &StudentResp{
			UserResp: UserResp{
				Account:              s.Account,
				AccountName:          s.AccountName,
				PhoneNumber:          s.PhoneNumber,
				RoleId:               s.RoleId,
				UserId:               s.UserId,
				GPA:                  s.GPA,
				SchoolName:           s.SchoolName,
				SchoolType:           s.SchoolType,
				Major:                s.Major,
				LanguageAchi:         s.LanguageAchi,
				Degree:               s.Degree,
				AcademicExperience:   s.AcademicExperience,
				IntentRegion:         s.IntentRegion,
				IntentMajor:          s.IntentMajor,
				OtherDetails:         s.OtherDetails,
				UserName:             s.UserName,
				AvatarUrl:            s.AvatarUrl,
				Gender:               s.Gender,
				Location:             s.Location,
				WechatID:             s.WechatID,
				Email:                s.Email,
				PersonalIntroduction: s.PersonalIntroduction,
				CreatedAt:            s.CreatedAt.Unix(),
				LastLogin:            s.LastLogin.Unix(),
			},
			Applications: s.Applications,
		}
	}
	return studentResp
}
