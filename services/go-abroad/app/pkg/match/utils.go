package match

import (
	"errors"
	"strconv"

	"patrick.com/abroad/app/constants"
)

func getSchoolTypeById(id int) *constants.Options {
	for _, value := range constants.SchoolType {
		if value.Value == id {
			return &value
		}
	}
	panic(errors.New("Error: school type id not found"))
	return nil
}

func getSchoolTypeStrValue(schoolTypeName string) string {
	return strconv.Itoa(constants.SchoolType[schoolTypeName].Value)
}

func getSchoolPriority(SchoolTypeId int) int {
	return getSchoolTypeById(SchoolTypeId).Priority
}
