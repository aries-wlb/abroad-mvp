package file

import (
	"io"
	"net/http"
	"os"

	"github.com/uptrace/bunrouter"
	fileDomain "patrick.com/abroad/app/domain/file"
	userDomain "patrick.com/abroad/app/domain/user"
	"patrick.com/abroad/app/middleware/jwt"
	"patrick.com/abroad/app/utils"
)

func (fh *FileHandler) uploadFile(w http.ResponseWriter, req bunrouter.Request) error {

	ctx := req.Context()
	userInfo := ctx.Value(jwt.UserCtxKey{}).(*userDomain.Claims)

	file := &fileDomain.File{
		UserId:   userInfo.Id,
		FileUrl:  "testUrl",
		FileName: "testName",
	}

	fileId, err := fh.FileImpl.Create(file)

	if err != nil {
		return err
	}

	return bunrouter.JSON(w, bunrouter.H{
		"msg":  "success",
		"code": 0,
		"data": &bunrouter.H{
			"file_id": fileId,
		},
	})
}

func (fh *FileHandler) uploadFileHandler(w http.ResponseWriter, req bunrouter.Request) error {
	ctx := req.Context()
	userInfo := ctx.Value(jwt.UserCtxKey{}).(*userDomain.Claims)

	file, header, err := req.FormFile("file")
	if err != nil {
		return utils.GenFailedResp(w, "Failed to retrieve file", http.StatusBadRequest)
	}
	defer file.Close()

	// 确保 uploads 文件夹存在
	err = os.MkdirAll("./uploads", os.ModePerm)
	if err != nil {
		return utils.GenFailedResp(w, "Failed to create uploads folder", http.StatusInternalServerError)
	}

	// 创建保存上传文件的本地路径
	realFileName := utils.GenerateRandomFileName()
	filePath := "./uploads/" + realFileName
	outFile, err := os.Create(filePath)
	if err != nil {
		return utils.GenFailedResp(w, "Failed to create file", http.StatusInternalServerError)
	}
	defer outFile.Close()

	// 将上传文件内容拷贝到本地文件中
	_, err = io.Copy(outFile, file)
	if err != nil {
		return utils.GenFailedResp(w, "Failed to create file", http.StatusInternalServerError)
	}

	fileEntity := &fileDomain.File{
		UserId:   userInfo.Id,
		FileName: header.Filename,
		FileUrl:  "/" + realFileName,
	}

	fileId, err := fh.FileImpl.Create(fileEntity)

	if err != nil {
		return err
	}

	return utils.GenSuccessResp(w, &bunrouter.H{
		"file_id":   fileId,
		"file_url":  fileEntity.FileUrl,
		"file_name": fileEntity.FileName,
	})
}
