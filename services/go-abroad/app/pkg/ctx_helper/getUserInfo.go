package ctx_helper

import (
	"context"

	userDomain "patrick.com/abroad/app/domain/user"
	"patrick.com/abroad/app/middleware/jwt"
)

func GetUserInfo(ctx context.Context) *userDomain.Claims {
	userInfo := ctx.Value(jwt.UserCtxKey{}).(*userDomain.Claims)
	return userInfo
}
