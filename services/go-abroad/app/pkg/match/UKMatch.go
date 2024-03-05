package match

import (
	"strings"

	"patrick.com/abroad/app/constants"
)

var ukCategories = []UKCategory{
	{
		Name: "G5",
		Conditions: UKCondition{
			BaseCondition: BaseCondition{
				TOEFL: 100,
				IELTS: 7.0,
			},
			IB:     40,
			AP:     3,
			ALevel: aLevelScore.AScore * 3,
		},
	},
	{
		Name: "Top100",
		Conditions: UKCondition{
			BaseCondition: BaseCondition{
				TOEFL: 80,
				IELTS: 6.5,
			},
			IB:     33,
			AP:     0,
			ALevel: aLevelScore.AScore * 3,
		},
	},
}

var ukMasterCategories = []UKCategory{
	{
		Name: "Top100",
		Conditions: UKCondition{
			BaseCondition: BaseCondition{
				IELTS:    6.5,
				GPA:      80.0,
				Priority: constants.SchoolType["985211"].Priority,
			},
		},
	},
	{
		Name: "Top100",
		Conditions: UKCondition{
			BaseCondition: BaseCondition{
				IELTS:    6.5,
				GPA:      85.0,
				Priority: constants.SchoolType["None"].Priority,
			},
		},
	},
}

var ukG5BCategories = []UKCategory{
	{
		Name: "G5商科-牛剑",
		Conditions: UKCondition{
			BaseCondition: BaseCondition{
				IELTS: 7.5,
				GMAT:  730,
				GPA:   87.5,
			},
		},
	},
	{
		Name: "G5商科-帝理&伦政&伦大",
		Conditions: UKCondition{
			BaseCondition: BaseCondition{
				IELTS:    6.5,
				GMAT:     700,
				GPA:      85.0,
				Priority: constants.SchoolType["985211"].Priority,
			},
		},
	},
	{
		Name: "G5商科-帝理&伦政&伦大",
		Conditions: UKCondition{
			BaseCondition: BaseCondition{
				IELTS:    6.5,
				GMAT:     700,
				GPA:      90.0,
				Priority: constants.SchoolType["None"].Priority,
			},
		},
	},
}

var ukG5SECategories = []UKCategory{
	{
		Name: "G5理工科-牛剑",
		Conditions: UKCondition{
			BaseCondition: BaseCondition{
				IELTS:    7,
				GRE:      320,
				GPA:      85,
				Priority: constants.SchoolType["985211"].Priority,
			},
		},
	},
	{
		Name: "G5理工科-牛剑",
		Conditions: UKCondition{
			BaseCondition: BaseCondition{
				IELTS:    7,
				GRE:      320,
				GPA:      90,
				Priority: constants.SchoolType["None"].Priority,
			},
		},
	},
}

func matchUKMasterCondition(c UKCondition, c_ UKCondition) bool {
	return c.IELTS >= c_.IELTS && c.Priority >= c_.Priority && c.GPA >= c_.GPA
}

func matchG5BMasterCondition(c UKCondition, c_ UKCondition) bool {
	return c.IELTS >= c_.IELTS &&
		c.Priority >= c_.Priority && c.GMAT >= c_.GMAT && c.GPA >= c_.GPA
}

func matchG5SEMasterCondition(c UKCondition, c_ UKCondition) bool {
	return c.IELTS >= c_.IELTS &&
		c.Priority >= c_.Priority && c.GRE >= c_.GRE && c.GPA >= c_.GPA
}

func matchUKCondition(c UKCondition, c_ UKCondition) bool {
	return (c.TOEFL >= c_.TOEFL || c.IELTS >= c_.IELTS) &&
		((c.IB >= c_.IB) || c.ALevel >= c_.ALevel) &&
		(c.AP >= c_.AP)
}

func UKMatch(condition UKCondition, degree int) string {
	if degree == constants.Degree["Master"].Value {
		var matches = []string{}
		all := make(map[string]bool)
		for _, category := range ukG5BCategories {
			matched := matchG5BMasterCondition(condition, category.Conditions)
			if matched && !all[category.Name] {
				all[category.Name] = true
				matches = append(matches, category.Name)
			}
		}

		for _, category := range ukG5SECategories {
			matched := matchG5SEMasterCondition(condition, category.Conditions)
			if matched && !all[category.Name] {
				all[category.Name] = true
				matches = append(matches, category.Name)
			}
		}

		for _, category := range ukMasterCategories {
			matched := matchUKMasterCondition(condition, category.Conditions)
			if matched && !all[category.Name] {
				all[category.Name] = true
				matches = append(matches, category.Name)
			}
		}

		return strings.Join(matches, ",")
	}
	for _, category := range ukCategories {
		matched := matchUKCondition(condition, category.Conditions)
		if matched {
			return category.Name
		}
	}
	return ""
}
