package role

import (
	"strconv"

	"github.com/google/wire"
	rp_domain "patrick.com/abroad/app/domain/role_permission"
	"patrick.com/abroad/app/logger"
	"patrick.com/abroad/app/pkg/casbin"
	"patrick.com/abroad/app/repository/permission"
	permission_repo "patrick.com/abroad/app/repository/permission"
	rp_repo "patrick.com/abroad/app/repository/role_permission"
)

var RoleImplSet = wire.NewSet(wire.Struct(new(RoleRepoImpl), "*"))

type Permission = rp_domain.Permission

type RoleRepoImpl struct {
	RoleRepo           RoleRepository
	RolePermissionRepo rp_repo.RolePermssionRepository
	PermissionRepo     permission_repo.PermissionRepository
}

func (r *RoleRepoImpl) Get(id int) (*Role, error) {
	user, err := r.RoleRepo.FindById(id)
	return user, err
}

func (r *RoleRepoImpl) Create(role Role) error {
	user := &Role{}
	err := r.RoleRepo.Create(user)
	return err
}

func (r *RoleRepoImpl) GetPermissionByRoleId(roleId int) ([]*Permission, error) {
	_, err := r.RoleRepo.FindById(roleId)
	if err != nil {
		return nil, err
	}

	// 根据 Role 查询对应的 RolePermissions
	rolePermissions, err := r.RolePermissionRepo.FindByRoleId(roleId)
	if err != nil {
		return nil, err
	}

	// 最后根据 RolePermissions 中的 Permission ID 查询对应的 Permissions
	var permissions []*permission.Permission
	for _, rp := range rolePermissions {
		permission, err := r.PermissionRepo.FindById(rp.PermissionId)
		if err != nil {
			return nil, err
		}
		permissions = append(permissions, permission)
	}

	return permissions, nil
}

// LoadPolicy 加载用户权限策略
func (r *RoleRepoImpl) LoadPolicyById(id int) error {

	role, roleError := r.RoleRepo.FindById(id)

	if roleError != nil {
		return roleError
	}

	field := strconv.Itoa(role.RoleId)

	casbin.Enforcer.DeleteRole(field)

	permissions, err := r.GetPermissionByRoleId(role.RoleId)

	for _, permission := range permissions {
		if permission.Path == "" || permission.Method == "" {
			continue
		}
		casbin.Enforcer.AddPermissionForUser(field, permission.Path, permission.Method)
	}

	return err
}

func (r *RoleRepoImpl) LoadPolicy(role *Role) {
	field := strconv.Itoa(role.RoleId)

	casbin.Enforcer.DeleteRole(field)

	for _, permission := range role.Permissions {
		if permission.Path == "" || permission.Method == "" {
			continue
		}
		casbin.Enforcer.AddPermissionForUser(field, permission.Path, permission.Method)
	}

}

// LoadAllPolicy 加载所有的用户策略
func (r *RoleRepoImpl) LoadAllPolicy() error {
	role := r.RoleRepo.GetAll(-1)
	for _, role := range *role {
		r.LoadPolicy(&role)
	}
	logger.Info("角色权限关系", casbin.Enforcer.GetGroupingPolicy())
	return nil
}
