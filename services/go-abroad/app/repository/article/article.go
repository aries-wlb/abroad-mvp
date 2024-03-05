package article

import (
	"context"
	"database/sql"

	"github.com/google/wire"
	"github.com/uptrace/bun"
	"patrick.com/abroad/app/domain/article"
)

type ArticleRepository struct {
	Db *bun.DB
}

var ArticleSet = wire.NewSet(wire.Struct(new(ArticleRepository), "*"))

type Article = article.Article

func (repo *ArticleRepository) FindById(id int) (*Article, error) {
	ctx := context.Background()
	article := &Article{}
	if err := repo.Db.NewSelect().Model(article).Where("article_id = ?", id).Scan(ctx); err != nil {
		return nil, err
	}
	return article, nil
}

func (repo *ArticleRepository) GetAll(limit int) ([]*Article, error) {
	ctx := context.Background()
	var articles = make([]*Article, 0)
	sql := repo.Db.NewSelect().Model(&articles)
	if limit > 0 {
		sql = sql.Limit(limit)
	}
	if err := sql.Scan(ctx); err != nil {
		return nil, err
	}
	return articles, nil
}

func (repo *ArticleRepository) Create(article *Article) (sql.Result, error) {
	ctx := context.Background()
	res, err := repo.Db.NewInsert().Model(article).Exec(ctx)
	if err != nil {
		return nil, err
	}
	return res, nil
}

func (repo *ArticleRepository) DeleteById(id int) error {
	ctx := context.Background()
	article := &Article{
		ArticleId: id,
	}
	_, err := repo.Db.NewDelete().Model(article).WherePK().Exec(ctx)
	if err != nil {
		return err
	}
	return nil
}

func (repo *ArticleRepository) Update(article *Article) error {
	ctx := context.Background()
	_, err := repo.Db.NewUpdate().Model(article).WherePK().Exec(ctx)
	if err != nil {
		return err
	}
	return nil
}

func (repo *ArticleRepository) CheckExistById(id int) (bool, error) {
	ctx := context.Background()
	article := &Article{
		ArticleId: id,
	}
	return repo.Db.NewSelect().Model(article).Exists(ctx)
}
