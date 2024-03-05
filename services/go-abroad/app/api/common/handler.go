package common

import (
	"net/http"
	"time"

	"github.com/google/wire"
	"github.com/uptrace/bunrouter"
	"patrick.com/abroad/app/constants"
	userDomain "patrick.com/abroad/app/domain/user"
	"patrick.com/abroad/app/logger"
	"patrick.com/abroad/app/repository/user"
	"patrick.com/abroad/app/utils"
)

var CommonSet = wire.NewSet(wire.Struct(new(CommonHandler), "*"))

func (c *CommonHandler) login(w http.ResponseWriter, req bunrouter.Request) error {
	var loginParam LoginReq
	err := utils.DecodeJSONBody(w, req, &loginParam)
	if err != nil {
		return err
	}
	exist, err := c.Impl.UserRepoImpl.CheckUser(loginParam.Account, loginParam.Password)
	if err != nil {
		return err
	}
	if !exist {
		return utils.GenFailedResp(w, "账号或密码错误", 401)
	}
	user, err := c.Impl.UserRepoImpl.GetByAccount(loginParam.Account)
	if err != nil {
		return err
	}

	lastLoginTime := time.Now()
	user.LastLogin = lastLoginTime
	go func(user *userDomain.User, c *CommonHandler) {
		err := c.Impl.UserRepoImpl.UpdateLastLogin(user)
		if err != nil {
			logger.Error("更新用户登录时间失败", err)
		}
	}(user, c)

	token, _ := utils.GenerateToken(user.UserId, user.Account, user.Password)
	return utils.GenSuccessResp(w, map[string]interface{}{
		"token": token,
		"user":  generateUserResp(user),
	})
}

func (c *CommonHandler) createUser(w http.ResponseWriter, req bunrouter.Request) error {
	var regParam RegReq
	err := utils.DecodeJSONBody(w, req, &regParam)
	if err != nil {
		return err
	}

	exist, err := c.Impl.UserRepoImpl.CheckAccountExist(regParam.Account)
	if err != nil {
		return err
	}

	if exist {
		return utils.GenFailedResp(w, "账号已存在", constants.ERROR_EXIST)
	}

	ub := user.UserBase{
		Account:     regParam.Account,
		AccountName: regParam.AccountName,
		PhoneNumber: regParam.PhoneNumber,
		Password:    regParam.Password,
		RoleId:      2,
	}

	err2 := c.Impl.UserRepoImpl.Create(ub)
	if err2 != nil {
		return err2
	}
	return utils.GenSuccessResp(w, nil)
}

func (c *CommonHandler) getAritical(w http.ResponseWriter, req bunrouter.Request) error {

	current, pageSize, err := utils.GetPaginationParams(req)
	if err != nil {
		return err
	}

	articles, err2 := c.Impl.ArticleImpl.GetAllArticles()
	if err2 != nil {
		return err2
	}
	return utils.GenPaginationResp(w, utils.Pagination{List: articles, Current: current, PageSize: pageSize})
}

func (c *CommonHandler) checkAccount(w http.ResponseWriter, req bunrouter.Request) error {
	var param CheckAccountReq
	err := utils.DecodeJSONBody(w, req, &param)
	if err != nil {
		return err
	}

	exist, err := c.Impl.UserRepoImpl.CheckAccountExist(param.Account)
	if err != nil {
		return err
	}

	return utils.GenSuccessResp(w, map[string]interface{}{
		"exist": exist,
	})

}
