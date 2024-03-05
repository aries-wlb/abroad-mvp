package utils

import (
	"encoding/json"
	"errors"
	"net/http"
	"reflect"

	"github.com/uptrace/bunrouter"
	"patrick.com/abroad/app/constants"
)

func JSON(w http.ResponseWriter, value map[string]interface{}) error {
	if value == nil {
		return nil
	}

	w.Header().Set("Content-Type", "application/json;charset=UTF-8")

	enc := json.NewEncoder(w)
	if err := enc.Encode(value); err != nil {
		return err
	}

	return nil
}

type ArrayHandler interface {
	Len() int
	Get(i int) interface{}
}

type Pagination struct {
	List     interface{}
	Current  int
	PageSize int
}

func GenPaginationResp(w http.ResponseWriter, data Pagination) error {
	listValue := reflect.ValueOf(data.List)
	if listValue.Kind() != reflect.Slice {
		return errors.New("Error: list parameter must be a slice")
	}

	current, pageSize := data.Current, data.PageSize

	if pageSize == -1 {
		list := make([]interface{}, listValue.Len())
		for i := 0; i < listValue.Len(); i++ {
			list[i] = listValue.Index(i).Interface()
		}
		return JSON(w, bunrouter.H{
			"msg":  "Success",
			"code": 0,
			"data": map[string]interface{}{
				"list":      list,
				"total":     listValue.Len(),
				"current":   current,
				"page_size": pageSize,
			},
		})

	}

	startIndex := (current - 1) * pageSize
	endIndex := startIndex + pageSize

	total := listValue.Len()

	if endIndex > total {
		endIndex = total
	}

	// 获取切片的长度

	// 根据计算得到的索引范围截取切片
	var pagedList []interface{}
	if startIndex >= total {
		pagedList = []interface{}{}
	} else {
		// pagedList = listValue.Slice(startIndex, endIndex)
		pagedListValue := listValue.Slice(startIndex, endIndex)
		pagedList = make([]interface{}, pagedListValue.Len())
		for i := 0; i < pagedListValue.Len(); i++ {
			pagedList[i] = pagedListValue.Index(i).Interface()
		}
	}
	return JSON(w, bunrouter.H{
		"msg":  "Success",
		"code": 0,
		"data": map[string]interface{}{
			"list":      pagedList,
			"total":     total,
			"current":   current,
			"page_size": pageSize,
		},
	})
}

func GenSuccessResp(w http.ResponseWriter, data interface{}) error {
	return JSON(w, bunrouter.H{
		"msg":  "Success",
		"code": 0,
		"data": data,
	})
}

func GenFailedResp(w http.ResponseWriter, msg string, code int) error {
	return JSON(w, bunrouter.H{
		"msg":  msg,
		"code": code,
	})
}

func GenNotExistResp(w http.ResponseWriter) error {
	return JSON(w, bunrouter.H{
		"msg":  constants.MsgFlags[constants.ERROR_NOT_EXIST],
		"code": constants.ERROR_NOT_EXIST,
	})
}
