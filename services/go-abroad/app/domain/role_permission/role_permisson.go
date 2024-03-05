package role_permission

type Permission struct {
	PermissionId int `bun:"permission_id,pk"`

	Path   string `bun:"path"`
	Method string `bun:"method"`
	Roles  []Role `bun:"m2m:role_permissions,join:Permission=Role"`
}

type Role struct {
	RoleId int `bun:"role_id,pk"`

	RoleName string

	Permissions []Permission `bun:"m2m:role_permissions,join:Role=Permission"`
}

type RolePermission struct {
	PermissionId int         `bun:"permission_id,pk"`
	Permission   *Permission `bun:"rel:belongs-to,join:permission_id=permission_id"`
	RoleId       int         `bun:"role_id,pk"`
	Role         *Role       `bun:"rel:belongs-to,join:role_id=role_id"`
}
