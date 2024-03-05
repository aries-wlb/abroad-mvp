package auth_common

import (
	"net/http"

	"github.com/google/wire"
	"github.com/uptrace/bunrouter"
	"patrick.com/abroad/app/constants"
	"patrick.com/abroad/app/pkg/match"
	"patrick.com/abroad/app/utils"
)

var AuthCommonSet = wire.NewSet(wire.Struct(new(AuthCommonHandler), "*"))

func (c *AuthCommonHandler) match(w http.ResponseWriter, req bunrouter.Request) error {
	var param MatchReq
	err := utils.DecodeJSONBody(w, req, &param)
	if err != nil {
		return err
	}
	res := match.Match(match.MatchParam{
		Region: param.IntentRegion,
		Degree: param.Degree,
		Condition: match.ConditionType{
			BaseCondition: match.BaseCondition{
				TOEFL:      param.TOEFL,
				IELTS:      param.IELTS,
				GMAT:       param.GMAT,
				GRE:        param.GRE,
				GPA:        param.GPA,
				SchoolType: param.SchoolType,
			},
			SAT:    param.SAT,
			ACT:    param.ACT,
			AP:     param.AP,
			IB:     param.IB,
			ALevel: param.ALevel,
		},
	})

	return utils.GenSuccessResp(w, genMatchResponse(res, param.IntentRegion))
}

func (c *AuthCommonHandler) getOptions(w http.ResponseWriter, req bunrouter.Request) error {
	schoolTypes := make([]SchoolTypeOption, len(constants.SchoolType))
	for _, value := range constants.SchoolType {
		schoolTypes[value.Value] = SchoolTypeOption{
			Value:  value.Value,
			Label:  value.Label,
			Degree: value.Degree,
		}
	}
	degrees := make([]Option, len(constants.Degree))
	for _, value := range constants.Degree {
		degrees[value.Value] = Option{
			Value: value.Value,
			Label: value.Label,
		}
	}
	return utils.GenSuccessResp(w, map[string]interface{}{"school_types": schoolTypes, "degrees": degrees})
}
