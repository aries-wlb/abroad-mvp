package app

import (
	"os"

	"net/http"

	"github.com/google/wire"
	"github.com/uptrace/bunrouter"
	"patrick.com/abroad/app/api"
	"patrick.com/abroad/app/logger"
	"patrick.com/abroad/app/repository"
)

func loadCasbinPolicyData(impl *repository.RepoImpl) error {
	err := impl.RoleImpl.LoadAllPolicy()
	if err != nil {
		return err
	}
	err = impl.UserRepoImpl.LoadAllPolicy()
	if err != nil {
		return err
	}

	return nil
}

var AppSet = wire.NewSet(wire.Struct(new(App), "*"), api.InitRoutes, loadCasbinPolicyData)

type App struct {
	router    *bunrouter.Router
	policyErr error
}

func (app *App) Run() {
	logger.Info("Starting server...")
	if app.policyErr != nil {
		panic("加载casbin策略数据发生错误: " + app.policyErr.Error())
	}
	port := os.Getenv("server.port")
	if port == "" {
		port = ":3000"
	}
	logger.Info("listing at 3000")
	http.ListenAndServe(port, app.router)
}
