package delivery

import (
	"TKPM/internals/domain"
	"TKPM/internals/models"
	"TKPM/utils"
	"context"
	"encoding/json"
	"net/http"
	"strconv"
)

type ReviewDelivery interface {
	Create(w http.ResponseWriter, r *http.Request)
	Update(w http.ResponseWriter, r *http.Request)
	GetReviewList(w http.ResponseWriter, r *http.Request)
	GetReviewById(w http.ResponseWriter, r *http.Request)
	GetReviewByAssignmentId(w http.ResponseWriter, r *http.Request)
}

type reviewDelivery struct {
	reviewDomain domain.Review
}

func NewReviewDelivery(ReviewDomain domain.Review) ReviewDelivery {
	return &reviewDelivery{
		reviewDomain: ReviewDomain,
	}
}

func (d *reviewDelivery) Create(w http.ResponseWriter, r *http.Request) {

	var req models.Review

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": "Invalid body"})
		return
	}

	res, err := d.reviewDomain.Create(context.Background(), &req)
	if err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": err.Error()})
		return
	}
	utils.ResponseWithJson(w, http.StatusOK, res)

}

func (d *reviewDelivery) Update(w http.ResponseWriter, r *http.Request) {

	var req models.Review

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": "Invalid body"})
		return
	}

	res, err := d.reviewDomain.Update(context.Background(), &req)
	if err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": err.Error()})
		return
	}
	utils.ResponseWithJson(w, http.StatusOK, res)
}

func (d *reviewDelivery) GetReviewList(w http.ResponseWriter, r *http.Request) {
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

	res, err := d.reviewDomain.GetReviewList(context.Background(), int64(offset), int64(limit))
	if err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": err.Error()})
		return
	}

	utils.ResponseWithJson(w, http.StatusOK, res)

}

func (d *reviewDelivery) GetReviewById(w http.ResponseWriter, r *http.Request) {
	reviewId := r.URL.Query()["reviewId"]
	if len(reviewId) == 0 {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": "Invalid body"})
		return
	}

	res, err := d.reviewDomain.GetReviewById(context.Background(), reviewId[0])
	if err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": err.Error()})
		return
	}
	utils.ResponseWithJson(w, http.StatusOK, res)
}

func (d *reviewDelivery) GetReviewByAssignmentId(w http.ResponseWriter, r *http.Request) {
	assignmentId := r.URL.Query()["assignmentId"]
	if len(assignmentId) == 0 {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": "Invalid body"})
		return
	}

	res, err := d.reviewDomain.GetReviewByAssignmentId(context.Background(), assignmentId[0])
	if err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": err.Error()})
		return
	}
	utils.ResponseWithJson(w, http.StatusOK, res)
}
