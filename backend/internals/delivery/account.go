package delivery

import (
	"TKPM/common/consts"
	"TKPM/internals/domain"
	"TKPM/internals/models"
	"TKPM/utils"
	"context"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type AccountDelivery interface {
	SignUp(w http.ResponseWriter, r *http.Request)
	SignUpAdmin(w http.ResponseWriter, r *http.Request)
	SignIn(w http.ResponseWriter, r *http.Request)
	SignInByToken(w http.ResponseWriter, r *http.Request)
	GetAccountById(w http.ResponseWriter, r *http.Request)
	GetAccountList(w http.ResponseWriter, r *http.Request)
	GetAdminAccountList(w http.ResponseWriter, r *http.Request)
	ForgotPassword(w http.ResponseWriter, r *http.Request)
	UpdateInfo(w http.ResponseWriter, r *http.Request)
	CheckAuth(accountId string) (*models.Account, error)
}

type accountDelivery struct {
	accountDomain domain.Account
	mail          domain.Mail
}

func NewAccountDelivery(accountDomain domain.Account, mail domain.Mail) AccountDelivery {
	return &accountDelivery{
		accountDomain: accountDomain,
		mail:          mail,
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

func (d *accountDelivery) SignUpAdmin(w http.ResponseWriter, r *http.Request) {
	var req models.Account

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": "Invalid body"})
		return
	}

	res, err := d.accountDomain.SignUpAdmin(context.Background(), &req)
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

func (d *accountDelivery) ForgotPassword(w http.ResponseWriter, r *http.Request) {
	var req models.Account

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": "Invalid body"})
		return
	}

	newPassword := uuid.New().String()[:8]
	bytes, err := bcrypt.GenerateFromPassword([]byte(newPassword), 14)
	if err != nil {
		utils.ResponseWithJson(w, http.StatusInternalServerError, map[string]string{"message": err.Error()})
		return
	}
	req.Password = string(bytes)
	if err := d.mail.SendEmail([]string{req.Email}, consts.SubjectToForgotPassword, "This is your new password: "+newPassword); err != nil {
		utils.ResponseWithJson(w, http.StatusInternalServerError, map[string]string{"message": err.Error()})
		return
	}

	if err := d.accountDomain.UpdateInfoByEmail(context.Background(), req.Email, &req); err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": err.Error()})
		return
	}

	utils.ResponseWithJson(w, http.StatusOK, nil)
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

func (d *accountDelivery) GetAccountList(w http.ResponseWriter, r *http.Request) {
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

	res, err := d.accountDomain.GetAccountList(context.Background(), int64(offset), int64(limit))
	if err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": err.Error()})
		return
	}

	utils.ResponseWithJson(w, http.StatusOK, res)
}

func (d *accountDelivery) GetAdminAccountList(w http.ResponseWriter, r *http.Request) {
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

	res, err := d.accountDomain.GetAdminAccountList(context.Background(), int64(offset), int64(limit))
	if err != nil {
		utils.ResponseWithJson(w, http.StatusBadRequest, map[string]string{"message": err.Error()})
		return
	}

	utils.ResponseWithJson(w, http.StatusOK, res)
}

func (d *accountDelivery) CheckAuth(accountId string) (*models.Account, error) {
	res, err := d.accountDomain.CheckAuth(context.Background(), accountId)
	if err != nil {
		return nil, err
	}
	return res, nil
}
