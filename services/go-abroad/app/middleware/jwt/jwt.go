package jwt

import (
	"context"
	"net/http"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/uptrace/bunrouter"

	"patrick.com/abroad/app/constants"
	"patrick.com/abroad/app/utils"
)

type UserCtxKey struct{}

func JWT(next bunrouter.HandlerFunc) bunrouter.HandlerFunc {
	return func(w http.ResponseWriter, req bunrouter.Request) error {
		var code int
		var data interface{}

		code = constants.SUCCESS
		Authorization := req.Header.Get("Authorization")
		token := strings.Split(Authorization, " ")
		var t *utils.Claims

		if Authorization == "" {
			code = constants.ERROR_NOT_LOGIN
		} else {
			var err error
			t, err = utils.ParseToken(token[1])
			if err != nil {
				switch err.(*jwt.ValidationError).Errors {
				case jwt.ValidationErrorExpired:
					code = constants.ERROR_AUTH_CHECK_TOKEN_TIMEOUT
				default:
					code = constants.ERROR_AUTH_CHECK_TOKEN_FAIL
				}
			}
		}

		if code != constants.SUCCESS {
			return bunrouter.JSON(w, bunrouter.H{
				"code": http.StatusUnauthorized,
				"msg":  utils.GetMessage(code),
				"data": data,
			})
		}

		ctx := req.Context()
		ctx = context.WithValue(ctx, UserCtxKey{}, t)

		return next(w, req.WithContext(ctx))
	}
}
