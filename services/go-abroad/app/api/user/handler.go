package user

import (
	"net/http"

	"github.com/google/wire"
	"github.com/uptrace/bunrouter"
	userDomain "patrick.com/abroad/app/domain/user"
	"patrick.com/abroad/app/middleware/jwt"
	userRepo "patrick.com/abroad/app/repository/user"
	"patrick.com/abroad/app/utils"
)

var UserSet = wire.NewSet(wire.Struct(new(UserHandler), "*"))

type UserHandler struct {
	UserImpl userRepo.UserRepoImpl
}

func (u *UserHandler) getUser(w http.ResponseWriter, req bunrouter.Request) error {
	ctx := req.Context()
	userInfo := ctx.Value(jwt.UserCtxKey{}).(*userDomain.Claims)

	user := u.UserImpl.Get(userInfo.Id)
	return utils.GenSuccessResp(w, map[string]interface{}{"user_info": generateUserResp(user)})
}

func (u *UserHandler) updateUser(w http.ResponseWriter, req bunrouter.Request) error {
	ctx := req.Context()
	userInfo := ctx.Value(jwt.UserCtxKey{}).(*userDomain.Claims)
	var updateReq UserUpdateReq
	err := utils.DecodeJSONBody(w, req, &updateReq)
	if err != nil {
		return err
	}

	user := u.UserImpl.Get(userInfo.Id)
	user.UserName = updateReq.UserName
	user.AccountName = updateReq.AccountName
	user.Degree = updateReq.Degree
	user.Email = updateReq.Email
	user.PhoneNumber = updateReq.PhoneNumber
	user.GPA = updateReq.GPA
	user.Major = updateReq.Major
	user.Gender = updateReq.Gender
	user.OtherDetails = updateReq.OtherDetails
	user.IntentMajor = updateReq.IntentMajor
	user.IntentRegion = updateReq.IntentRegion
	user.LanguageAchi = updateReq.LanguageAchi
	user.WechatID = updateReq.WechatID
	user.Location = updateReq.Location
	user.PersonalIntroduction = updateReq.PersonalIntroduction
	user.AcademicExperience = updateReq.AcademicExperience
	user.SchoolName = updateReq.SchoolName
	user.SchoolType = updateReq.SchoolType

	err = u.UserImpl.UpdateUser(user)

	if err != nil {
		return err
	}

	return utils.GenSuccessResp(w, map[string]interface{}{})
}
