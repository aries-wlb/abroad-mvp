package article

import (
	"database/sql"

	"github.com/google/wire"
)

var ArticleImplSet = wire.NewSet(wire.Struct(new(ArticleImpl), "*"))

type ArticleImpl struct {
	ArticleRepo ArticleRepository
}

func (ai *ArticleImpl) GetById(id int) (*Article, error) {
	article, err := ai.ArticleRepo.FindById(id)
	if err != nil {
		return nil, err
	}
	return article, nil
}

func (ai *ArticleImpl) GetAllArticles() ([]*Article, error) {
	articles, err := ai.ArticleRepo.GetAll(-1)
	if err != nil {
		return nil, err
	}
	return articles, nil
}

func (ai *ArticleImpl) AddArticle(a *Article) (sql.Result, error) {
	res, err := ai.ArticleRepo.Create(a)
	return res, err
}

func (ai *ArticleImpl) DeleteArticleById(id int) error {
	err := ai.ArticleRepo.DeleteById(id)
	return err
}

func (ai *ArticleImpl) UpdateArticle(a *Article) error {
	err := ai.ArticleRepo.Update(a)
	return err
}

func (ai *ArticleImpl) CheckExist(id int) (bool, error) {
	return ai.ArticleRepo.CheckExistById(id)
}
