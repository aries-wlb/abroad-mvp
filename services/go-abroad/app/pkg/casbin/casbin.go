package casbin

import (
	"github.com/casbin/casbin"
	"patrick.com/abroad/app/logger"
)

var Enforcer *casbin.Enforcer

// 初始化依赖注入
func init() {

	// 注入casbin
	path := "app/conf/rbac_model.conf"
	enforcer, err := casbin.NewEnforcerSafe(path, false)

	Enforcer = enforcer
	logger.Info("casbin init", err)
}

// 加载casbin策略数据，包括角色权限数据、用户角色数据
