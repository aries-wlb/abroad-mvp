package permission

import (
	"context"

	"github.com/google/wire"
	"github.com/uptrace/bun"
	"patrick.com/abroad/app/domain/role_permission"
)

type Permission = role_permission.Permission

var PermissionSet = wire.NewSet(wire.Struct(new(PermissionRepository), "*"))

type PermissionRepository struct {
	Db *bun.DB
}

func (repo *PermissionRepository) FindById(id int) (*Permission, error) {
	ctx := context.Background()
	role := &Permission{}
	if err := repo.Db.NewSelect().Model(role).Where("permission_id = ?", id).Scan(ctx); err != nil {
		return nil, err
	}
	return role, nil
}

func (repo *PermissionRepository) GetAll(limit int) *[]Permission {
	ctx := context.Background()
	var role []Permission
	if limit > 0 {
		if err := repo.Db.NewSelect().Model(&role).Limit(limit).Scan(ctx); err != nil {
			panic(err)
		}
	} else {
		if err := repo.Db.NewSelect().Model(&role).Scan(ctx); err != nil {
			panic(err)
		}
	}
	return &role
}

func (repo *PermissionRepository) Create(r *Permission) error {
	ctx := context.Background()
	_, err := repo.Db.NewInsert().Model(r).Exec(ctx)
	if err != nil {
		return err
	}
	return nil
}
