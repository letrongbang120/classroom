package domain

import (
	"fmt"
	"net/smtp"
	"strings"
)

type Mail interface {
	SendEmail(to []string, subject, message string) error
}

type mail struct {
	host  string
	port  string
	email string
	auth  smtp.Auth
}

type mailFormat struct {
	Sender  string
	To      []string
	Subject string
	Body    string
}

func NewMailer(email, password, host, port string) Mail {
	auth := smtp.PlainAuth("", email, password, host)
	return &mail{
		auth:  auth,
		host:  host,
		port:  port,
		email: email,
	}
}

func (m *mail) Address() string {
	return m.host + ":" + m.port
}

func (m *mail) SendEmail(to []string, subject, message string) error {
	if err := smtp.SendMail(m.Address(), m.auth, m.email, to, []byte(BuildMessage(mailFormat{
		Sender:  m.email,
		To:      to,
		Subject: subject,
		Body:    message,
	}))); err != nil {
		return err
	}
	return nil
}

func BuildMessage(mail mailFormat) string {
	msg := "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\r\n"
	msg += fmt.Sprintf("From: %s\r\n", mail.Sender)
	msg += fmt.Sprintf("To: %s\r\n", strings.Join(mail.To, ";"))
	msg += fmt.Sprintf("Subject: %s\r\n", mail.Subject)
	msg += fmt.Sprintf("\r\n%s\r\n", mail.Body)
	return msg
}
