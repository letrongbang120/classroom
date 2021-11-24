package delivery

import (
	"TKPM/internals/domain"
	"TKPM/internals/models"
	"TKPM/utils"
	"context"
	"encoding/json"
	"net/http"
)

type AccountDelivery interface {
	SignUp(w http.ResponseWriter, r *http.Request)
	SignIn(w http.ResponseWriter, r *http.Request)
	SignInByToken(w http.ResponseWriter, r *http.Request)
	GetAccountById(w http.ResponseWriter, r *http.Request)
	UpdateInfo(w http.ResponseWriter, r *http.Request)
	CheckAuth(accountId string) (*models.Account, error)
}

type accountDelivery struct {
	accountDomain domain.Account
}

func NewAccountDelivery(accountDomain domain.Account) AccountDelivery {
	return &accountDelivery{
		accountDomain: accountDomain,
	}
}

func (d *accountDelivery) SignUp(w http.ResponseWriter, r *http.Request) {

	var req models.Account

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": "Invalid body"})
		return
	}

	res, err := d.accountDomain.SignUp(context.Background(), &req)
	if err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": err.Error()})
		return
	}

	utils.ResponseWithJson(w, http.StatusOK, res)
}

func (d *accountDelivery) UpdateInfo(w http.ResponseWriter, r *http.Request) {
	var req models.Account

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": "Invalid body"})
		return
	}

	res, err := d.accountDomain.UpdateInfo(context.Background(), r.Context().Value("account_id").(string), &req)
	if err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": err.Error()})
		return
	}

	utils.ResponseWithJson(w, http.StatusOK, res)
}

func (d *accountDelivery) SignInByToken(w http.ResponseWriter, r *http.Request) {
	var req models.Account
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": "Invalid body"})
		return
	}

	res, tkn, err := d.accountDomain.SignInByToken(context.Background(), &req)
	if err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": err.Error()})
		return
	}

	utils.ResponseWithJson(w, http.StatusOK, &models.Account{
		Token:     tkn,
		AccountID: res.AccountID,
		StudentID: res.StudentID,
		Role:      res.Role,
		Username:  res.Username,
		Email:     res.Email,
		Phone:     res.Phone,
		Age:       res.Age,
	})
}

func (d *accountDelivery) SignIn(w http.ResponseWriter, r *http.Request) {
	var req models.Account

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": "Invalid body"})
		return
	}

	res, tkn, err := d.accountDomain.SignIn(context.Background(), &req)
	if err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": err.Error()})
		return
	}

	utils.ResponseWithJson(w, http.StatusOK, &models.Account{
		Token:     tkn,
		AccountID: res.AccountID,
		StudentID: res.StudentID,
		Role:      res.Role,
		Username:  res.Username,
		Email:     res.Email,
		Phone:     res.Phone,
		Age:       res.Age,
	})
}

func (d *accountDelivery) GetAccountById(w http.ResponseWriter, r *http.Request) {

	accountId := r.URL.Query()["accountId"]
	if len(accountId) == 0 {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": "Invalid body"})
		return
	}

	res, err := d.accountDomain.CheckAuth(context.Background(), accountId[0])
	if err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": err.Error()})
		return
	}
	res.Password = ""

	utils.ResponseWithJson(w, http.StatusOK, res)
}

func (d *accountDelivery) CheckAuth(accountId string) (*models.Account, error) {
	res, err := d.accountDomain.CheckAuth(context.Background(), accountId)
	if err != nil {
		return nil, err
	}
	return res, nil
}
