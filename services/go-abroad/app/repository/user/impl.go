package user

import (
	"strconv"

	"github.com/google/wire"
	"patrick.com/abroad/app/logger"
	"patrick.com/abroad/app/pkg/casbin"
)

var UserImplSet = wire.NewSet(wire.Struct(new(UserRepoImpl), "*"))

type UserRepoImpl struct {
	UserRepo UserRepository
	// ApplicationRepo applicationRepo.ApplicationRepository
	// FileRepo file.FileRepository
}

func (ud *UserRepoImpl) Get(id int) *User {
	user := ud.UserRepo.FindById(id)
	return user
}

func (ud *UserRepoImpl) CheckUser(account string, pw string) (bool, error) {
	exist, err := ud.UserRepo.CheckUser(account, pw)
	return exist, err
}

func (ud *UserRepoImpl) CheckAccountExist(account string) (bool, error) {
	user := &User{
		UserBase: UserBase{
			Account: account,
		},
	}
	exist, err := ud.UserRepo.CheckExist(user)
	return exist, err
}

func (ud *UserRepoImpl) GetByAccount(account string) (*User, error) {
	user, err := ud.UserRepo.FindByAccount(account)
	return user, err
}

func (ud *UserRepoImpl) Create(ub UserBase) error {
	user := &User{
		UserBase: ub,
	}
	err := ud.UserRepo.Create(user)
	if err == nil {
		ud.LoadPolicy(user)
	}
	return err
}

func (ud *UserRepoImpl) UpdateUser(u *User) error {
	err := ud.UserRepo.Update(u)
	if err == nil {
		ud.LoadPolicy(u)
	}
	return err
}

func (ud *UserRepoImpl) UpdateLastLogin(u *User) error {
	err := ud.UserRepo.UpdateCol("last_login", u)
	return err
}

func (ud *UserRepoImpl) GetByRole(roleId int) ([]*User, error) {
	users, err := ud.UserRepo.FindByRole(roleId)
	return users, err
}

func (ud *UserRepoImpl) GetStudents() ([]*User, error) {
	students, err := ud.UserRepo.GetAllStudent()
	return students, err
}

// LoadPolicy 加载用户权限策略
func (ud *UserRepoImpl) LoadPolicyById(id int) error {

	user := ud.UserRepo.FindById(id)

	casbin.Enforcer.DeleteRolesForUser(user.Account)

	casbin.Enforcer.AddRoleForUser(user.Account, strconv.Itoa(user.RoleId))

	return nil
}

func (ud *UserRepoImpl) LoadPolicy(user *User) error {

	casbin.Enforcer.DeleteRolesForUser(user.Account)

	casbin.Enforcer.AddRoleForUser(user.Account, strconv.Itoa(user.RoleId))

	return nil
}

// LoadAllPolicy 加载所有的用户策略
func (ud *UserRepoImpl) LoadAllPolicy() error {
	users := ud.UserRepo.GetAll(-1)
	for _, user := range users {
		ud.LoadPolicy(user)
	}
	logger.Info("更新角色权限关系", "关系", casbin.Enforcer.GetGroupingPolicy())
	return nil
}
