package delivery

import (
	"TKPM/internals/domain"
	"TKPM/internals/models"
	"TKPM/utils"
	"context"
	"encoding/json"
	"net/http"
)

type InvitationDelivery interface {
	GetLink(w http.ResponseWriter, r *http.Request)
	Join(w http.ResponseWriter, r *http.Request)
}

type invitationDelivery struct {
	classDomain domain.Class
}

func NewInvitationDelivery(classDomain domain.Class) InvitationDelivery {
	return &invitationDelivery{
		classDomain: classDomain,
	}
}

func (d *invitationDelivery) GetLink(w http.ResponseWriter, r *http.Request) {
	res, err := d.classDomain.GetClassById(context.Background(), r.Context().Value("class_id").(string))
	if err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": err.Error()})
		return
	}

	utils.ResponseWithJson(w, http.StatusOK, map[string]string{"link": utils.GetLink(res.ClassID)})
}

func (d *invitationDelivery) Join(w http.ResponseWriter, r *http.Request) {
	var data models.JoinClassRequest

	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		responseWithJson(w, http.StatusBadRequest, map[string]string{"message": "Invalid body"})
		return
	}
	res, err := d.classDomain.AddStudent(context.Background(), data.ClassID, r.Context().Value("account_id").(string))
	if err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": err.Error()})
		return
	}

	utils.ResponseWithJson(w, http.StatusOK, res)
}
