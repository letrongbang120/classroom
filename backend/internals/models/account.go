package models

import (
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

const AccountCollection = "account"

type Account struct {
	AccountID string `json:"accountId,omitempty" bson:"account_id,omitempty"`
	StudentID string `json:"studentId,omitempty" bson:"student_id,omitempty"`
	Role      string `json:"role,omitempty" bson:"role,omitempty"`
	Username  string `json:"username,omitempty" bson:"username,omitempty"`
	Password  string `json:"password,omitempty" bson:"password,omitempty"`
	Email     string `json:"email,omitempty" bson:"email,omitempty"`
	Phone     string `json:"phone,omitempty" bson:"phone,omitempty"`
	Age       int    `json:"age,omitempty" bson:"age,omitempty"`
	Token     string `json:"token,omitempty" bson:"token,omitempty"`
	Block     bool   `json:"block,omitempty" bson:"block,omitempty"`
}

// HashPassword : hash password using crypto
func (u *Account) HashPassword() error {
	bytes, err := bcrypt.GenerateFromPassword([]byte(u.Password), 14)
	if err != nil {
		return err
	}
	u.Password = string(bytes)
	fmt.Println(u.Password)
	return nil
}

// IsCorrectPassword : check password with passwordhash
func (u *Account) IsCorrectPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
	return err == nil
}
