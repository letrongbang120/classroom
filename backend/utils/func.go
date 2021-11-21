package utils

import (
	"TKPM/common/consts"
	"encoding/json"
	"net/http"
)

func ResponseWithJson(writer http.ResponseWriter, status int, object interface{}) {
	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(status)
	json.NewEncoder(writer).Encode(object)
}

func GetLink(classId string) string {
	return consts.Host + "/" + classId
}

func GetInviteMessage(classId string) string {
	return "Click this link to join classroom: " + GetLink(classId)
}
