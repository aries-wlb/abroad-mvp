package role_permission

import (
	"context"

	"github.com/google/wire"
	"github.com/uptrace/bun"
	"patrick.com/abroad/app/domain/role_permission"
)

type RolePermission = role_permission.RolePermission

var RolePermssionSet = wire.NewSet(wire.Struct(new(RolePermssionRepository), "*"))

type RolePermssionRepository struct {
	Db *bun.DB
}

func (repo *RolePermssionRepository) FindByRoleId(roleId int) ([]*RolePermission, error) {
	ctx := context.Background()
	var permissions []*RolePermission
	if err := repo.Db.NewSelect().Model(&permissions).Where("role_id = ?", roleId).Scan(ctx); err != nil {
		return nil, err
	}
	return permissions, nil
}
