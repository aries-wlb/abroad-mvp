package user

import (
	"context"

	"github.com/google/wire"
	"github.com/uptrace/bun"
	"patrick.com/abroad/app/domain/user"
)

var UserSet = wire.NewSet(wire.Struct(new(UserRepository), "*"))

type UserRepository struct {
	Db *bun.DB
}

type User = user.User
type UserBase = user.UserBase

func (repo *UserRepository) FindById(id int) (user *User) {
	ctx := context.Background()
	user = &User{}
	if err := repo.Db.NewSelect().Model(user).Where("user_id = ?", id).Scan(ctx); err != nil {
		panic(err)
	}
	return
}

func (repo *UserRepository) FindByAccount(account string) (user *User, err error) {
	ctx := context.Background()
	user = &User{}
	if err := repo.Db.NewSelect().Model(user).Where("account = ?", account).Scan(ctx); err != nil {
		return nil, err
	}
	return
}

func (repo *UserRepository) FindByRole(roleId int) (users []*User, err error) {
	ctx := context.Background()
	if err := repo.Db.NewSelect().Model(&users).Where("role_id = ?", roleId).Scan(ctx); err != nil {
		return nil, err
	}
	return
}

func (repo *UserRepository) GetAllStudent() (users []*User, err error) {
	ctx := context.Background()
	if err := repo.Db.NewSelect().Model(&users).Relation("Applications").Where("role_id = ?", user.RoleStudent).Scan(ctx); err != nil {
		return nil, err
	}
	return
}

func (repo *UserRepository) CheckExist(user *User) (bool, error) {
	ctx := context.Background()
	sql := repo.Db.NewSelect().Model(user)
	if user.Account != "" {
		sql.Where("account = ?", user.Account)
	}
	return sql.Exists(ctx)
}

func (repo *UserRepository) CheckUser(account string, pw string) (bool, error) {
	ctx := context.Background()
	result, err := repo.Db.NewSelect().Model((*User)(nil)).Where("account = ?", account).Where("password = ?", pw).Exists(ctx)
	if err != nil {
		return false, err
	}
	return result, nil
}

func (repo *UserRepository) GetAll(limit int) []*User {
	ctx := context.Background()
	var users []*User
	if limit > 0 {
		if err := repo.Db.NewSelect().Model(&users).Limit(limit).Scan(ctx); err != nil {
			panic(err)
		}
	} else {
		if err := repo.Db.NewSelect().Model(&users).Scan(ctx); err != nil {
			panic(err)
		}
	}
	return users
}

func (repo *UserRepository) Create(user *User) error {
	ctx := context.Background()
	_, err := repo.Db.NewInsert().Model(user).Exec(ctx)
	if err != nil {
		return err
	}
	return nil
}

func (repo *UserRepository) Update(user *User) error {
	ctx := context.Background()
	_, err := repo.Db.NewUpdate().Model(user).WherePK().Exec(ctx)
	if err != nil {
		return err
	}
	return nil
}

func (repo *UserRepository) UpdateCol(colName string, user *User) error {
	ctx := context.Background()
	_, err := repo.Db.NewUpdate().Model(user).Column(colName).WherePK().Exec(ctx)
	if err != nil {
		return err
	}
	return nil
}
