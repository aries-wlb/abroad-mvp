package admin

import (
	"net/http"
	"strconv"

	"github.com/google/wire"
	"github.com/uptrace/bunrouter"
	"patrick.com/abroad/app/domain/article"
	"patrick.com/abroad/app/utils"
)

var AdminSet = wire.NewSet(wire.Struct(new(AdminHandler), "*"))

func (a *AdminHandler) getUserByRole(w http.ResponseWriter, req bunrouter.Request) error {
	role_id, err := strconv.Atoi(req.URL.Query().Get("role_id"))
	if err != nil {
		return err
	}
	current, pageSize, err1 := utils.GetPaginationParams(req)
	if err1 != nil {
		return err1
	}

	users, err2 := a.Impl.UserRepoImpl.GetByRole(role_id)
	if err2 != nil {
		return err2
	}

	return utils.GenPaginationResp(w, utils.Pagination{List: generateUsersResp(users), Current: current, PageSize: pageSize})
}

func (a *AdminHandler) getStudents(w http.ResponseWriter, req bunrouter.Request) error {
	current, pageSize, err1 := utils.GetPaginationParams(req)
	if err1 != nil {
		return err1
	}

	students, err2 := a.Impl.UserRepoImpl.GetStudents()
	if err2 != nil {
		return err2
	}

	return utils.GenPaginationResp(w, utils.Pagination{List: generateStudentsResp(students), Current: current, PageSize: pageSize})
}

func (a *AdminHandler) updateUser(w http.ResponseWriter, req bunrouter.Request) error {
	var updateReq UserUpdateReq
	err := utils.DecodeJSONBody(w, req, &updateReq)
	if err != nil {
		return err
	}

	user := a.Impl.UserRepoImpl.Get(updateReq.UserId)
	user.UserName = updateReq.UserName
	user.AccountName = updateReq.AccountName
	user.Email = updateReq.Email
	user.PhoneNumber = updateReq.PhoneNumber
	user.Degree = updateReq.Degree
	user.GPA = updateReq.GPA
	user.Major = updateReq.Major
	user.Gender = updateReq.Gender
	user.OtherDetails = updateReq.OtherDetails
	user.IntentMajor = updateReq.IntentMajor
	user.IntentRegion = updateReq.IntentRegion
	user.LanguageAchi = updateReq.LanguageAchi
	user.WechatID = updateReq.WechatID
	user.Location = updateReq.Location
	user.PersonalIntroduction = updateReq.PersonalIntroduction
	user.AcademicExperience = updateReq.AcademicExperience
	user.SchoolName = updateReq.SchoolName
	user.SchoolType = updateReq.SchoolType
	user.RoleId = updateReq.RoleId

	err = a.Impl.UserRepoImpl.UpdateUser(user)

	if err != nil {
		return err
	}

	return utils.GenSuccessResp(w, map[string]interface{}{})
}

func (a *AdminHandler) addArticle(w http.ResponseWriter, req bunrouter.Request) error {
	var updateReq ArticleUpdateReq
	err := utils.DecodeJSONBody(w, req, &updateReq)
	if err != nil {
		return err
	}

	article := &article.Article{
		ArticleUrl: updateReq.ArticleUrl,
		Author:     updateReq.Author,
		Content:    updateReq.Content,
		Title:      updateReq.Title,
	}

	_, err1 := a.Impl.ArticleImpl.AddArticle(article)
	if err1 != nil {
		return err1
	}

	return utils.GenSuccessResp(w, map[string]interface{}{})
}

func (a *AdminHandler) deleteArticle(w http.ResponseWriter, req bunrouter.Request) error {
	var updateReq ArticleDeleteReq
	err := utils.DecodeJSONBody(w, req, &updateReq)
	if err != nil {
		return err
	}

	exist, err2 := a.Impl.ArticleImpl.CheckExist(updateReq.ArticleId)
	if err2 != nil {
		return err2
	}
	if !exist {
		return utils.GenNotExistResp(w)
	}

	err3 := a.Impl.ArticleImpl.DeleteArticleById(updateReq.ArticleId)

	if err3 != nil {
		return err3
	}

	return utils.GenSuccessResp(w, map[string]interface{}{})
}

func (a *AdminHandler) updateArticle(w http.ResponseWriter, req bunrouter.Request) error {

	var updateReq ArticleUpdateReq
	err := utils.DecodeJSONBody(w, req, &updateReq)
	if err != nil {
		return err
	}

	article, err2 := a.Impl.ArticleImpl.GetById(updateReq.ArticleId)
	if err2 != nil {
		return err2
	}
	article.ArticleUrl = updateReq.ArticleUrl
	article.Author = updateReq.Author
	article.Content = updateReq.Content
	article.Title = updateReq.Title

	err3 := a.Impl.ArticleImpl.UpdateArticle(article)
	if err3 != nil {
		return err3
	}

	return utils.GenSuccessResp(w, map[string]interface{}{})
}
