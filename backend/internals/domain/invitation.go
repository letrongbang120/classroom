package domain

import (
	"TKPM/common/consts"
	"TKPM/utils"
	"context"
)

type Invitation interface {
	InviteByEmail(ctx context.Context, emailList []string, classId string) error
}

type invitationDomain struct {
	mail Mail
}

func NewInvitationDomain(mail Mail) Invitation {
	return &invitationDomain{
		mail: mail,
	}
}

func (d *invitationDomain) InviteByEmail(ctx context.Context, emailList []string, classId string) error {
	if err := d.mail.SendEmail(emailList, consts.SubjectToInvite, utils.GetInviteMessage((classId))); err != nil {
		return err
	}
	return nil
}
