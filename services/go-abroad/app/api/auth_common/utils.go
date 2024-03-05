package auth_common

func genMatchResponse(res string, region string) map[string]interface{} {
	if res == "" {
		return map[string]interface{}{
			"result_msg":  "Sorry, you are not qualified for any school in " + region + ", please verify the conditions submitted.",
			"result_code": 0,
		}
	}
	return map[string]interface{}{
		"result_msg":  "Congratulations! You are qualified for " + res + " in " + region + "!",
		"result_code": 500,
	}
}
