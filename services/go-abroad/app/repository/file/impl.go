package file

import "github.com/google/wire"

type FileRepoImpl struct {
	FileRepo FileRepository
}

var FileImplSet = wire.NewSet(wire.Struct(new(FileRepoImpl), "*"))

func (ud *FileRepoImpl) Create(file *File) (int, error) {
	res, err := ud.FileRepo.Create(file)
	if err != nil {
		return -1, err
	}
	id, _ := res.LastInsertId()
	return int(id), nil
}
