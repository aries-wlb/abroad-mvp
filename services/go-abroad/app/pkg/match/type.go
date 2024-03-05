package match

type USCategory struct {
	Name       string
	Conditions USCondition
}

type UKCategory struct {
	Name       string
	Conditions UKCondition
}

type BaseCondition struct {
	TOEFL      float64
	IELTS      float64
	GMAT       int
	GRE        int
	GPA        float64
	SchoolType int
	Priority   int
}

type ConditionType struct {
	BaseCondition
	SAT    int
	ACT    int
	AP     int
	IB     int
	ALevel int
}

type USCondition struct {
	BaseCondition
	SAT int
	ACT int
	AP  int
}

type UKCondition struct {
	BaseCondition
	AP     int
	IB     int
	ALevel int
}

type ALevelScore struct {
	AScore  int
	BScore  int
	APScore int
}

type AUCategory struct {
	Name       string
	Conditions AUCondition
}

type AUCondition struct {
	BaseCondition
}

type HKCategory struct {
	Name       string
	Conditions HKCondition
}

type HKCondition struct {
	BaseCondition
	ALevel int
}

type ScoreMap = map[string]float64

type School struct {
	Name    string
	BScore  ScoreMap
	SeScore ScoreMap
}
