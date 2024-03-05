package file_server

import (
	"net/http"

	"github.com/uptrace/bunrouter"
)

var (
	rootDir = "./uploads" // 根目录路径
)

func Init(router *bunrouter.Group) {
	// fileServer := http.FileServer(http.FS(filesFS))
	fs := http.FileServer(http.Dir(rootDir))

	router.GET("/*path", bunrouter.HTTPHandler(fs))
}
