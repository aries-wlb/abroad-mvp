package role

import (
	"context"

	"github.com/google/wire"
	"github.com/uptrace/bun"
	"patrick.com/abroad/app/domain/role_permission"
)

var RoleSet = wire.NewSet(wire.Struct(new(RoleRepository), "*"))

type RoleRepository struct {
	Db *bun.DB
}

type Role = role_permission.Role

func (repo *RoleRepository) FindById(id int) (*Role, error) {
	ctx := context.Background()
	role := &Role{}
	if err := repo.Db.NewSelect().Model(role).Where("role_id = ?", id).Scan(ctx); err != nil {
		return nil, err
	}
	return role, nil
}

func (repo *RoleRepository) GetAll(limit int) *[]Role {
	ctx := context.Background()
	var role []Role
	if limit > 0 {
		if err := repo.Db.NewSelect().Model(&role).Relation("Permissions").Limit(limit).Scan(ctx); err != nil {
			panic(err)
		}
	} else {
		if err := repo.Db.NewSelect().Model(&role).Relation("Permissions").Scan(ctx); err != nil {
			panic(err)
		}
	}
	return &role
}

func (repo *RoleRepository) Create(r *Role) error {
	ctx := context.Background()
	_, err := repo.Db.NewInsert().Model(r).Exec(ctx)
	if err != nil {
		return err
	}
	return nil
}
