package match

import (
	"strconv"
	"strings"

	"patrick.com/abroad/app/constants"
)

var auCategories = []AUCategory{
	{
		Name: "八大除了墨大",
		Conditions: AUCondition{
			BaseCondition: BaseCondition{
				TOEFL: 80,
				IELTS: 6.5,
			},
		},
	},
}

func genAUCondition(GPA float64) AUCondition {
	return AUCondition{
		BaseCondition: BaseCondition{
			IELTS: 6.5,
			GPA:   GPA,
		},
	}
}

var auSchools = []School{
	{
		Name: "墨尔本大学",
		BScore: ScoreMap{
			getSchoolTypeStrValue("Tier1"):  80.0,
			getSchoolTypeStrValue("985211"): 85.0,
			getSchoolTypeStrValue("None"):   90.0,
		},
		SeScore: ScoreMap{
			getSchoolTypeStrValue("985211"): 75.0,
			getSchoolTypeStrValue("985"):    75.0,
			getSchoolTypeStrValue("211"):    80.0,
			getSchoolTypeStrValue("None"):   90.0,
		},
	},
	{
		Name: "澳国立大学",
		BScore: ScoreMap{
			getSchoolTypeStrValue("985211"): 75.0,
			getSchoolTypeStrValue("None"):   85.0,
		},
		SeScore: ScoreMap{
			getSchoolTypeStrValue("985211"): 75.0,
			getSchoolTypeStrValue("None"):   85.0,
		},
	},
	{
		Name: "悉尼大学",
		BScore: ScoreMap{
			getSchoolTypeStrValue("C9"):     65.0,
			getSchoolTypeStrValue("985211"): 75.0,
			getSchoolTypeStrValue("None"):   87.0,
		},
		SeScore: ScoreMap{
			getSchoolTypeStrValue("985211"): 75.0,
			getSchoolTypeStrValue("None"):   80.0,
		},
	},
	{
		Name: "新南威尔士大学",
		BScore: ScoreMap{
			getSchoolTypeStrValue("985211"): 72.0,
			getSchoolTypeStrValue("None"):   88.0,
		},
		SeScore: ScoreMap{
			getSchoolTypeStrValue("985211"): 76.0,
			getSchoolTypeStrValue("None"):   80.0,
		},
	},
	{
		Name: "昆士兰大学",
		BScore: ScoreMap{
			getSchoolTypeStrValue("985211"): 75.0,
			getSchoolTypeStrValue("None"):   85.0,
		},
		SeScore: ScoreMap{
			getSchoolTypeStrValue("985211"): 75.0,
			getSchoolTypeStrValue("None"):   80.0,
		},
	},
	{
		Name: "莫纳什大学",
		BScore: ScoreMap{
			getSchoolTypeStrValue("None"): 80.0,
		},
		SeScore: ScoreMap{
			getSchoolTypeStrValue("985211"): 69.0,
			getSchoolTypeStrValue("None"):   80.0,
		},
	},
	{
		Name: "西澳大学",
		BScore: ScoreMap{
			getSchoolTypeStrValue("985211"): 70.0,
			getSchoolTypeStrValue("None"):   75.0,
		},
		SeScore: ScoreMap{
			getSchoolTypeStrValue("985211"): 70.0,
			getSchoolTypeStrValue("None"):   80.0,
		},
	},
	{
		Name: "阿德莱德大学",
		BScore: ScoreMap{
			getSchoolTypeStrValue("985211"): 75.0,
			getSchoolTypeStrValue("None"):   80.0,
		},
		SeScore: ScoreMap{
			getSchoolTypeStrValue("985211"): 75.0,
			getSchoolTypeStrValue("None"):   80.0,
		},
	},
}

func genAUMasterBCategories(schoolType int) []AUCategory {
	var categories = []AUCategory{}
	for _, school := range auSchools {
		bScore := school.BScore[strconv.Itoa(schoolType)]
		defaultKey := getSchoolTypeStrValue("None")
		if bScore == 0 {
			bScore = school.SeScore[defaultKey]
		}
		categories = append(categories, AUCategory{
			Name:       school.Name + "-商科",
			Conditions: genAUCondition(bScore),
		})
		seScore := school.SeScore[strconv.Itoa(schoolType)]
		if seScore == 0 {
			seScore = school.SeScore[defaultKey]
		}
		categories = append(categories, AUCategory{
			Name:       school.Name + "-工科",
			Conditions: genAUCondition(seScore),
		})
	}
	return categories
}

func matchAUCondition(c AUCondition, c_ AUCondition) bool {
	return (c.TOEFL >= c_.TOEFL || c.IELTS >= c_.IELTS) && (c.SchoolType == constants.SchoolType["IS_YB"].Value || c.GPA >= 70)
}

func matchAUMasterBCondition(c AUCondition, c_ AUCondition) bool {
	return c.IELTS >= c_.IELTS && c.GPA >= c_.GPA
}

func AUMatch(condition AUCondition, degree int) string {
	if degree == constants.Degree["Master"].Value {
		var matches = []string{}
		for _, category := range genAUMasterBCategories(condition.SchoolType) {
			matched := matchAUMasterBCondition(condition, category.Conditions)
			if matched {
				matches = append(matches, category.Name)
			}
		}
		return strings.Join(matches, ",")
	}
	for _, category := range auCategories {
		matched := matchAUCondition(condition, category.Conditions)
		if matched {
			return category.Name
		}
	}
	return ""
}
