package delivery

import (
	"TKPM/configs"
	"TKPM/internals/domain"
	"TKPM/internals/models"
	"TKPM/utils"
	"bytes"
	"context"
	"encoding/json"
	"io"
	"net/http"
	"strconv"
	"strings"
)

type ClassDelivery interface {
	UploadImage(w http.ResponseWriter, r *http.Request)
	Create(w http.ResponseWriter, r *http.Request)
	Update(w http.ResponseWriter, r *http.Request)
	GetClassList(w http.ResponseWriter, r *http.Request)
	GetClassById(w http.ResponseWriter, r *http.Request)
	GetClassByAccountId(w http.ResponseWriter, r *http.Request)
}

type classDelivery struct {
	classDomain   domain.Class
	storageConfig configs.Storage
}

func NewClassDelivery(classDomain domain.Class, storageConfig configs.Storage) ClassDelivery {
	return &classDelivery{
		classDomain:   classDomain,
		storageConfig: storageConfig,
	}
}

func (d *classDelivery) UploadImage(w http.ResponseWriter, r *http.Request) {
	var buf bytes.Buffer
	file, header, err := r.FormFile("image")
	if err != nil {
		panic(err)
	}
	defer file.Close()
	name := strings.Split(header.Filename, ".")
	io.Copy(&buf, file)
	res, err := d.classDomain.UploadImage(context.Background(), buf.Bytes(), name[0], header.Size, d.storageConfig)
	if err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": err.Error()})
		return
	}

	utils.ResponseWithJson(w, http.StatusOK, map[string]string{"url": *res})
}

func (d *classDelivery) Create(w http.ResponseWriter, r *http.Request) {

	var req models.Class

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": "Invalid body"})
		return
	}

	res, err := d.classDomain.Create(context.Background(), &req)
	if err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": err.Error()})
		return
	}
	utils.ResponseWithJson(w, http.StatusOK, res)

}

func (d *classDelivery) Update(w http.ResponseWriter, r *http.Request) {

	var req models.Class

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": "Invalid body"})
		return
	}

	res, err := d.classDomain.Update(context.Background(), &req)
	if err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": err.Error()})
		return
	}
	utils.ResponseWithJson(w, http.StatusOK, res)
}

func (d *classDelivery) GetClassList(w http.ResponseWriter, r *http.Request) {
	offset := 0
	limit := 0
	offsetPra := r.URL.Query()["offset"]
	limitPra := r.URL.Query()["limit"]

	if len(offsetPra) > 0 {
		i, err := strconv.Atoi(offsetPra[0])
		if err != nil {
			utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": "Invalid body"})
			return
		}
		offset = i
	}

	if len(limitPra) > 0 {
		i, err := strconv.Atoi(limitPra[0])
		if err != nil {
			utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": "Invalid body"})
			return
		}
		limit = i
	}

	res, err := d.classDomain.GetClassList(context.Background(), int64(offset), int64(limit))
	if err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": err.Error()})
		return
	}

	utils.ResponseWithJson(w, http.StatusOK, res)

}

func (d *classDelivery) GetClassById(w http.ResponseWriter, r *http.Request) {
	classId := r.URL.Query()["classId"]
	if len(classId) == 0 {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": "Invalid body"})
		return
	}

	res, err := d.classDomain.GetClassById(context.Background(), classId[0])
	if err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": err.Error()})
		return
	}
	utils.ResponseWithJson(w, http.StatusOK, res)
}

func (d *classDelivery) GetClassByAccountId(w http.ResponseWriter, r *http.Request) {
	accountId := r.URL.Query()["accountId"]
	if len(accountId) == 0 {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": "Invalid body"})
		return
	}

	res, err := d.classDomain.GetClassByAccountID(context.Background(), accountId[0])
	if err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": err.Error()})
		return
	}
	utils.ResponseWithJson(w, http.StatusOK, res)
}
