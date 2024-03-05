package match

import (
	"strconv"

	"patrick.com/abroad/app/constants"
)

var hkCategories = []HKCategory{
	{
		Name: "Top3",
		Conditions: HKCondition{
			BaseCondition: BaseCondition{
				IELTS: 6.5,
			},
			ALevel: aLevelScore.AScore * 3,
		},
	},
	{
		Name: "Other not Top3",
		Conditions: HKCondition{
			BaseCondition: BaseCondition{
				IELTS: 6,
			},
			ALevel: aLevelScore.AScore*2 + aLevelScore.BScore*1,
		},
	},
}

var hkSchools = []School{
	{
		Name: "Top3",
		BScore: ScoreMap{
			getSchoolTypeStrValue("985211"): 85.0,
			getSchoolTypeStrValue("None"):   90.0,
			"GMAT":                          680,
		},
		SeScore: ScoreMap{
			getSchoolTypeStrValue("985211"): 80.0,
			getSchoolTypeStrValue("None"):   85.0,
			"GRE":                           320,
		},
	},
	{
		Name: "Other not Top3",
		BScore: ScoreMap{
			getSchoolTypeStrValue("985211"): 85.0,
			getSchoolTypeStrValue("None"):   87.0,
			"GMAT":                          650,
		},
		SeScore: ScoreMap{
			getSchoolTypeStrValue("985211"): 78.0,
			getSchoolTypeStrValue("None"):   80.0,
		},
	},
}

func genHKMasterCategories(schoolType int) []HKCategory {
	categories := make([]HKCategory, len(hkSchools))
	for _, school := range hkSchools {
		bScore := school.BScore[strconv.Itoa(schoolType)]
		nonKey := getSchoolTypeStrValue("None")
		if bScore == 0 {
			bScore = school.SeScore[nonKey]
		}
		categories = append(categories, HKCategory{
			Name: school.Name + "-商科",
			Conditions: HKCondition{
				BaseCondition: BaseCondition{
					IELTS: 6.5,
					GPA:   bScore,
					GMAT:  int(school.BScore["GMAT"]),
				},
			},
		})
		seScore := school.SeScore[strconv.Itoa(schoolType)]
		if seScore == 0 {
			seScore = school.SeScore[nonKey]
		}
		categories = append(categories, HKCategory{
			Name: school.Name + "-工科",
			Conditions: HKCondition{
				BaseCondition: BaseCondition{
					IELTS: 6.0,
					GPA:   seScore,
					GMAT:  int(school.BScore["GRE"]),
				},
			},
		})
	}
	return categories
}

func matchHKCondition(c HKCondition, c_ HKCondition) bool {
	return c.IELTS > c_.IELTS && c.ALevel >= c_.ALevel
}

func matchHKMasterCondition(c HKCondition, c_ HKCondition) bool {
	return c.IELTS > c_.IELTS && c.ALevel >= c_.ALevel
}

func HKMatch(condition HKCondition, degree int) string {
	if degree == constants.Degree["Master"].Value {
		for _, category := range genHKMasterCategories(condition.SchoolType) {
			matched := matchHKMasterCondition(condition, category.Conditions)
			if matched {
				return category.Name
			}
		}
		return ""
	}
	for _, category := range hkCategories {
		matched := matchHKCondition(condition, category.Conditions)
		if matched {
			return category.Name
		}
	}
	return ""
}
