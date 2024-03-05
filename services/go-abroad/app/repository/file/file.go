package file

import (
	"context"
	"database/sql"

	"github.com/google/wire"
	"github.com/uptrace/bun"
	"patrick.com/abroad/app/domain/file"
)

var FileSet = wire.NewSet(wire.Struct(new(FileRepository), "*"))

type FileRepository struct {
	Db *bun.DB
}

type File = file.File

func (repo *FileRepository) Create(file *File) (sql.Result, error) {
	ctx := context.Background()
	res, err := repo.Db.NewInsert().Model(file).Exec(ctx)
	if err != nil {
		return nil, err
	}
	return res, nil
}

func (repo *FileRepository) FindById(id int) (*File, error) {
	ctx := context.Background()
	file := &File{}
	if err := repo.Db.NewSelect().Model(file).Where("file_id = ?", id).Scan(ctx); err != nil {
		return nil, err
	}
	return file, nil
}

func (repo *FileRepository) FindByAppId(id int) ([]*File, error) {
	ctx := context.Background()
	var files = make([]*File, 0)
	sql := repo.Db.NewSelect().Model(&files).Where("application_id = ?", id)
	if err := sql.Scan(ctx); err != nil {
		return nil, err
	}
	return files, nil

}

func (repo *FileRepository) BulkUpdate(files []*File, col string, overwrite bool) error {
	ctx := context.Background()
	sql := repo.Db.NewUpdate().
		Model(&files).
		Column(col).
		Bulk()

	if !overwrite {
		sql = sql.Where("file.? IS NULL", bun.Ident(col))
	}
	_, err := sql.Exec(ctx)

	if err != nil {
		return err
	}
	return nil
}
