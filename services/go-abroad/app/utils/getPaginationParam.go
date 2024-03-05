package utils

import (
	"strconv"

	"github.com/uptrace/bunrouter"
)

func GetPaginationParams(req bunrouter.Request) (int, int, error) {
	currentStr := req.URL.Query().Get("current")
	pageSizeStr := req.URL.Query().Get("page_size")

	current, err := strconv.Atoi(currentStr)
	if err != nil {
		return 0, 0, err
	}

	pageSize, err2 := strconv.Atoi(pageSizeStr)
	if err2 != nil {
		return 0, 0, err2
	}

	return current, pageSize, nil
}
