package application

import (
	"context"
	"database/sql"

	"github.com/google/wire"
	"github.com/uptrace/bun"
	"patrick.com/abroad/app/domain/application"
)

type ApplicationRepository struct {
	Db *bun.DB
}

var ApplicationSet = wire.NewSet(wire.Struct(new(ApplicationRepository), "*"))

type Application = application.Application
type ApplicationQuery = application.ApplicationQuery

func (repo *ApplicationRepository) FindById(id int) (*Application, error) {
	ctx := context.Background()
	application := &Application{}
	if err := repo.Db.NewSelect().Model(application).Where("application_id = ?", id).Scan(ctx); err != nil {
		return nil, err
	}
	return application, nil
}

func (repo *ApplicationRepository) FindByParam(query *ApplicationQuery) ([]*Application, error) {
	ctx := context.Background()
	var applications = make([]*Application, 0)
	var sql = repo.Db.NewSelect().Model(&applications)

	if query.ApplicationId != nil {
		sql.Where("application_id = ?", query.ApplicationId)
	}
	if condition := query.UserId != nil; condition {
		sql.Where("user_id = ?", query.UserId)
	}

	if condition := query.School != ""; condition {
		sql.Where("school = ?", query.School)
	}

	if condition := query.Major != ""; condition {
		sql.Where("major = ?", query.Major)
	}

	if condition := query.Status != 0; condition {
		sql.Where("status = ?", query.Status)
	}

	if condition := query.Type != ""; condition {
		sql.Where("type = ?", query.Type)
	}

	if err := sql.Scan(ctx); err != nil {
		return nil, err
	}
	return applications, nil
}

func (repo *ApplicationRepository) DeleteById(id int) error {
	ctx := context.Background()
	application := &Application{}
	if _, err := repo.Db.NewDelete().Model(application).Where("application_id = ?", id).Exec(ctx); err != nil {
		return err
	}
	return nil
}

func (repo *ApplicationRepository) CheckExist(application *Application) (bool, error) {
	ctx := context.Background()
	return repo.Db.NewSelect().Model(application).Exists(ctx)
}

func (repo *ApplicationRepository) CountByUserId(id int) (int, error) {
	ctx := context.Background()
	count, err := repo.Db.NewSelect().Model((*Application)(nil)).Where("user_id = ?", id).Count(ctx)
	if err != nil {
		return 0, err
	}
	return count, nil
}

func (repo *ApplicationRepository) FindByUserId(id int) ([]*Application, error) {
	ctx := context.Background()
	var applications = make([]*Application, 0)
	sql := repo.Db.NewSelect().Model(&applications).Where("user_id = ?", id)
	if err := sql.Scan(ctx); err != nil {
		return nil, err
	}
	return applications, nil
}

func (repo *ApplicationRepository) Create(application *Application) (sql.Result, error) {
	ctx := context.Background()
	res, err := repo.Db.NewInsert().Model(application).Exec(ctx)
	if err != nil {
		return nil, err
	}
	return res, nil
}

func (repo *ApplicationRepository) Update(application *Application) error {
	ctx := context.Background()
	_, err := repo.Db.NewUpdate().Model(application).WherePK().Exec(ctx)
	if err != nil {
		return err
	}
	return nil
}

func (repo *ApplicationRepository) UpdateCol(colName string, application *Application) error {
	ctx := context.Background()
	_, err := repo.Db.NewUpdate().Model(application).Column(colName).WherePK().Exec(ctx)
	if err != nil {
		return err
	}
	return nil
}
