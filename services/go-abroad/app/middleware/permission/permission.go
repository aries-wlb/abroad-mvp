package permission

import (
	"net/http"

	uerDomain "patrick.com/abroad/app/domain/user"
	"patrick.com/abroad/app/middleware/jwt"
	"patrick.com/abroad/app/pkg/casbin"

	"github.com/uptrace/bunrouter"
)

func CasbinMiddleware(next bunrouter.HandlerFunc) bunrouter.HandlerFunc {
	return func(w http.ResponseWriter, req bunrouter.Request) error {
		ctx := req.Context()
		userInfo := ctx.Value(jwt.UserCtxKey{}).(*uerDomain.Claims)

		if b, _ := casbin.Enforcer.HasRoleForUser(userInfo.Account, "1"); b {
			return next(w, req)
		}

		if b, err := casbin.Enforcer.EnforceSafe(userInfo.Account, req.URL.Path, req.Method); err != nil {
			return bunrouter.JSON(w, bunrouter.H{
				"code": http.StatusUnauthorized,
				"msg":  "unauthorized",
				"data": err,
			})
		} else if !b {
			return bunrouter.JSON(w, bunrouter.H{
				"code": http.StatusUnauthorized,
				"msg":  "unauthorized",
				"data": "登录用户 没有权限",
			})
		}
		return next(w, req)
	}
}
