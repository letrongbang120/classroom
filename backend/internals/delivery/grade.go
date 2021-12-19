package delivery

import (
	"TKPM/configs"
	"TKPM/internals/domain"
	"TKPM/internals/models"
	"TKPM/utils"
	"context"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
)

type GradeDelivery interface {
	CreateGrade(w http.ResponseWriter, r *http.Request)
	UpdateGrade(w http.ResponseWriter, r *http.Request)
	GetGradeList(w http.ResponseWriter, r *http.Request)
	GetGradeById(w http.ResponseWriter, r *http.Request)
	GetGradeOfStudent(w http.ResponseWriter, r *http.Request)

	CreateAssignment(w http.ResponseWriter, r *http.Request)
	UpdateAssignment(w http.ResponseWriter, r *http.Request)
	GetAssignmentList(w http.ResponseWriter, r *http.Request)
	GetAssignmentById(w http.ResponseWriter, r *http.Request)

	UploadGradeList(w http.ResponseWriter, r *http.Request)
}

type gradeDelivery struct {
	gradeDomain      domain.Grade
	assignmentDomain domain.Assignment
	csvDomain        domain.Csv
	storageConfig    configs.Storage
}

func NewGradeDelivery(gradeDomain domain.Grade, assignmentDomain domain.Assignment, csvDomain domain.Csv, storageConfig configs.Storage) GradeDelivery {
	return &gradeDelivery{
		gradeDomain:      gradeDomain,
		assignmentDomain: assignmentDomain,
		csvDomain: csvDomain,
		storageConfig:    storageConfig,
	}
}

func (d *gradeDelivery) UploadGradeList(w http.ResponseWriter, r *http.Request) {
	path := strings.Split(r.URL.Path, "/")
	if len(path) < 6 {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": "missing assignment id"})
		return
	}
	data, err := d.csvDomain.ReadData(r.Body)
	if err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": "Invalid body"})
		return
	}

	if err := d.gradeDomain.UploadGradeList(context.Background(), data, path[5]); err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"err ": err.Error()})
		return
	}

	utils.ResponseWithJson(w, http.StatusOK, "upload student list successfully")
}

func (d *gradeDelivery) CreateGrade(w http.ResponseWriter, r *http.Request) {

	var req models.Grade

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": "Invalid body"})
		return
	}

	res, err := d.gradeDomain.Create(context.Background(), &req)
	if err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": err.Error()})
		return
	}
	utils.ResponseWithJson(w, http.StatusOK, res)

}

func (d *gradeDelivery) UpdateGrade(w http.ResponseWriter, r *http.Request) {

	var req models.Grade

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": "Invalid body"})
		return
	}

	res, err := d.gradeDomain.Update(context.Background(), &req)
	if err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": err.Error()})
		return
	}
	utils.ResponseWithJson(w, http.StatusOK, res)
}

func (d *gradeDelivery) GetGradeOfStudent(w http.ResponseWriter, r *http.Request) {
	accountId := r.URL.Query()["accountId"]
	if len(accountId) == 0 {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": "Invalid body"})
		return
	}

	res, err := d.gradeDomain.GetGradeOfStudent(context.Background(), accountId[0])
	if err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": err.Error()})
		return
	}
	utils.ResponseWithJson(w, http.StatusOK, res)
}

func (d *gradeDelivery) GetGradeList(w http.ResponseWriter, r *http.Request) {
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

	res, err := d.gradeDomain.GetGradeList(context.Background(), int64(offset), int64(limit))
	if err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": err.Error()})
		return
	}

	utils.ResponseWithJson(w, http.StatusOK, res)

}

func (d *gradeDelivery) GetGradeById(w http.ResponseWriter, r *http.Request) {
	assignmentId, studentId := r.URL.Query()["assignmentId"], r.URL.Query()["studentId"]
	if len(assignmentId) == 0 || len(studentId) == 0 {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": "Invalid body"})
		return
	}

	res, err := d.gradeDomain.GetGradeById(context.Background(), assignmentId[0], studentId[0])
	if err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": err.Error()})
		return
	}
	utils.ResponseWithJson(w, http.StatusOK, res)
}

func (d *gradeDelivery) CreateAssignment(w http.ResponseWriter, r *http.Request) {
	var req models.Assignment

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": "Invalid body"})
		return
	}

	res, err := d.assignmentDomain.Create(context.Background(), &req)
	if err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": err.Error()})
		return
	}
	utils.ResponseWithJson(w, http.StatusOK, res)

}

func (d *gradeDelivery) UpdateAssignment(w http.ResponseWriter, r *http.Request) {

	var req models.Assignment

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": "Invalid body"})
		return
	}

	res, err := d.assignmentDomain.Update(context.Background(), &req)
	if err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": err.Error()})
		return
	}
	utils.ResponseWithJson(w, http.StatusOK, res)
}

func (d *gradeDelivery) GetAssignmentList(w http.ResponseWriter, r *http.Request) {
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

	res, err := d.assignmentDomain.GetAssignmentList(context.Background(), int64(offset), int64(limit))
	if err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": err.Error()})
		return
	}

	utils.ResponseWithJson(w, http.StatusOK, res)

}

func (d *gradeDelivery) GetAssignmentById(w http.ResponseWriter, r *http.Request) {
	assignmentId := r.URL.Query()["assignmentId"]
	if len(assignmentId) == 0 {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": "Invalid body"})
		return
	}

	res, err := d.assignmentDomain.GetAssignmentById(context.Background(), assignmentId[0])
	if err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": err.Error()})
		return
	}
	utils.ResponseWithJson(w, http.StatusOK, res)
}
