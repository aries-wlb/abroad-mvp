package utils

import "patrick.com/abroad/app/constants"

func GetMessage(code int) string {
	msg, ok := constants.MsgFlags[code]
	if ok {
		return msg
	}

	return constants.MsgFlags[constants.ERROR]
}
