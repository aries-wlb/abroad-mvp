package match

type MatchParam struct {
	Region    string
	Degree    int
	Condition ConditionType
}

func Match(param MatchParam) string {
	switch param.Region {
	case "US":
		condition := USCondition{
			BaseCondition: param.Condition.BaseCondition,
			SAT:           param.Condition.SAT,
			ACT:           param.Condition.ACT,
			AP:            param.Condition.AP,
		}
		condition.Priority = getSchoolPriority(condition.SchoolType)
		return USMatch(condition, param.Degree)
	case "UK":
		condition := UKCondition{
			BaseCondition: param.Condition.BaseCondition,
			AP:            param.Condition.AP,
			IB:            param.Condition.IB,
			ALevel:        param.Condition.ALevel,
		}
		condition.Priority = getSchoolPriority(condition.SchoolType)
		return UKMatch(condition, param.Degree)
	case "HK":
		condition := HKCondition{
			BaseCondition: param.Condition.BaseCondition,
			ALevel:        param.Condition.ALevel,
		}
		condition.Priority = getSchoolPriority(condition.SchoolType)
		return HKMatch(condition, param.Degree)
	case "AUS":
		condition := AUCondition{
			BaseCondition: param.Condition.BaseCondition,
		}
		condition.Priority = getSchoolPriority(condition.SchoolType)
		return AUMatch(condition, param.Degree)
	}
	return ""
}
