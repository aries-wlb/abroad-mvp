package constants

type Options struct {
	Value    int    `json:"value"`
	Label    string `json:"label"`
	Priority int    `json:"priority"`
	Degree   int    `json:"degree"`
}

var SchoolType = map[string]Options{
	"None": {
		Value:    0,
		Label:    "双非",
		Priority: 0,
		Degree:   1,
	},
	"211": {
		Value:    1,
		Label:    "211",
		Priority: 1,
		Degree:   1,
	},
	"985": {
		Value:    2,
		Label:    "985",
		Priority: 2,
		Degree:   1,
	},
	"985211": {
		Value:    3,
		Label:    "985 & 211",
		Priority: 3,
		Degree:   1,
	},
	"Tier1": {
		Value:    4,
		Label:    "Tier1",
		Priority: 0,
		Degree:   1,
	},
	"C9": {
		Value:    5,
		Label:    "C9",
		Priority: 0,
		Degree:   1,
	},
	"IS_YB": {
		Value:    6,
		Label:    "一本",
		Priority: 0,
		Degree:   0,
	},
	"NOT_YB": {
		Value:    7,
		Label:    "非一本",
		Priority: 0,
		Degree:   0,
	},
}
