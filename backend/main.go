package main

import (
	"fmt"
	"net/smtp"
	"strings"
)

// smtpServer data to smtp server
type smtpServer struct {
	host string
	port string
}

type Mail struct {
	Sender  string
	To      []string
	Subject string
	Body    string
}

// Address URI to smtp server
func (s *smtpServer) Address() string {
	return s.host + ":" + s.port
}

func main() {
	// Sender data.
	from := "go.normal.icontrol@gmail.com"
	password := "haopro123"
	// Receiver email address.
	to := []string{
		"letrongbang0102@gmail.com",
	}
	message := "Click this link to join classroom http://localhost:3000"
	mail := Mail{
		Sender:  from,
		To:      to,
		Subject: "Test Send Invitation",
		Body:    message,
	}

	// smtp server configuration.
	smtpServer := smtpServer{host: "smtp.gmail.com", port: "587"}
	// Message.
	// Authentication.
	auth := smtp.PlainAuth("", from, password, smtpServer.host)
	// Sending email.
	err := smtp.SendMail(smtpServer.Address(), auth, from, to, []byte(BuildMessage(mail)))
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println("Email Sent!")
}

func BuildMessage(mail Mail) string {
	msg := "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\r\n"
	msg += fmt.Sprintf("From: %s\r\n", mail.Sender)
	msg += fmt.Sprintf("To: %s\r\n", strings.Join(mail.To, ";"))
	msg += fmt.Sprintf("Subject: %s\r\n", mail.Subject)
	msg += fmt.Sprintf("\r\n%s\r\n", mail.Body)

	return msg
}
