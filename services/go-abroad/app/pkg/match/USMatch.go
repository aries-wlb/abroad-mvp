package match

import "patrick.com/abroad/app/constants"

var usCategories = []USCategory{
	{
		Name: "top10",
		Conditions: USCondition{
			BaseCondition: BaseCondition{
				TOEFL: 110,
				IELTS: 8.0,
				GPA:   85.0,
			},
			SAT: 1520,
			ACT: 33,
			AP:  12,
		},
	},
	{
		Name: "top10 ~ top30",
		Conditions: USCondition{
			BaseCondition: BaseCondition{
				TOEFL: 105,
				IELTS: 7.5,
				GPA:   85.0,
			},
			SAT: 1470,
			ACT: 32,
			AP:  12,
		},
	},
	{
		Name: "top30 ~ top50",
		Conditions: USCondition{
			BaseCondition: BaseCondition{
				TOEFL: 95,
				IELTS: 7,
				GPA:   80.0,
			},
			SAT: 1410,
			ACT: 30,
			AP:  12,
		},
	},
	{
		Name: "top50 ~ top100",
		Conditions: USCondition{
			BaseCondition: BaseCondition{
				TOEFL: 80,
				IELTS: 6.5,
				GPA:   80.0,
			},
			SAT: 0,
			ACT: 0,
			AP:  0,
		},
	},
}

var usMasterCategories = []USCategory{
	{
		Name: "top30",
		Conditions: USCondition{
			BaseCondition: BaseCondition{
				TOEFL: 105,
				IELTS: 7.5,
				GMAT:  700,
				GRE:   320,
				GPA:   88.0,
			},
		},
	},
	{
		Name: "top50",
		Conditions: USCondition{
			BaseCondition: BaseCondition{
				TOEFL: 100,
				IELTS: 7,
				GRE:   315,
				GMAT:  680,
				GPA:   85.0,
			},
		},
	},
	{
		Name: "top100",
		Conditions: USCondition{
			BaseCondition: BaseCondition{
				TOEFL: 90,
				IELTS: 6.5,
				GRE:   312,
				GMAT:  650,
				GPA:   80.0,
			},
		},
	},
}

func matchUSMasterCondition(c USCondition, c_ USCondition) bool {
	return (c.TOEFL >= c_.TOEFL || c.IELTS >= c_.IELTS) &&
		((c.GRE >= c_.GRE) || c.GMAT >= c_.GMAT) &&
		(c.GPA >= c_.GPA)
}

func matchUSCondition(c USCondition, c_ USCondition) bool {
	return (c.TOEFL >= c_.TOEFL || c.IELTS >= c_.IELTS) &&
		((c.SAT >= c_.SAT) || c.ACT >= c_.ACT) &&
		(c.AP >= 3) && (c.GPA >= c_.GPA)
}

func USMatch(condition USCondition, degree int) string {
	if degree == constants.Degree["Master"].Value {
		for _, category := range usMasterCategories {
			matched := matchUSMasterCondition(condition, category.Conditions)
			if matched {
				return category.Name
			}
		}
		return ""
	}
	for _, category := range usCategories {
		matched := matchUSCondition(condition, category.Conditions)
		if matched {
			return category.Name
		}
	}
	return ""
}
