package domain

import (
	"TKPM/common/core"
	"TKPM/common/enums"
	"TKPM/common/errors"
	"TKPM/internals/models"
	"TKPM/internals/repository"
	"context"

	requestinfo "TKPM/pkg/requestInfo"
	"TKPM/pkg/token"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type Account interface {
	SignUp(ctx context.Context, req *models.Account) (*models.Account, error)
	SignUpAdmin(ctx context.Context, req *models.Account) (*models.Account, error)
	SignIn(ctx context.Context, req *models.Account) (*models.Account, string, error)
	SignInByToken(ctx context.Context, req *models.Account) (*models.Account, string, error)
	UpdateInfo(ctx context.Context, accountId string, req *models.Account) (*models.Account, error)
	CheckAuth(ctx context.Context, accountId string) (*models.Account, error)
	GetAccountList(ctx context.Context, offset, limit int64) ([]*models.Account, error)
	GetAdminAccountList(ctx context.Context, offset, limit int64) ([]*models.Account, error)
}

type accountDomain struct {
	accountRepository repository.Account
	authenticator     token.Authenticator
}

func NewAccountDomain(accountRepository repository.Account, authenticator token.Authenticator) Account {
	return &accountDomain{
		accountRepository: accountRepository,
		authenticator:     authenticator,
	}
}

func (d *accountDomain) SignUp(ctx context.Context, req *models.Account) (*models.Account, error) {
	res, err := d.accountRepository.FindByEmail(ctx, req.Email)
	if res != nil {
		return nil, err
	}
	req.Role = enums.User.String()
	res, err = d.accountRepository.Create(ctx, req)
	if err != nil {
		return nil, err
	}

	core.SetMapAccountStudent(res.AccountID, res.StudentID)
	return &models.Account{
		AccountID: res.AccountID,
	}, nil
}

func (d *accountDomain) SignUpAdmin(ctx context.Context, req *models.Account) (*models.Account, error) {
	res, err := d.accountRepository.FindByEmail(ctx, req.Email)
	if res != nil {
		return nil, err
	}
	req.Role = enums.Admin.String()
	res, err = d.accountRepository.Create(ctx, req)
	if err != nil {
		return nil, err
	}

	return &models.Account{
		AccountID: res.AccountID,
	}, nil
}

func (d *accountDomain) SignIn(ctx context.Context, req *models.Account) (*models.Account, string, error) {
	res, err := d.accountRepository.FindByEmail(ctx, req.Email)
	if res == nil {
		return nil, "", err
	}

	if !res.IsCorrectPassword(req.Password) {
		return nil, "", errors.ErrPasswordIsNotCorrect
	}

	tkn, err := d.authenticator.Generate(&requestinfo.Info{
		AccountID: res.AccountID,
	})

	if err != nil {
		return nil, "", status.Errorf(codes.Internal, "gen token %w", err)
	}

	return res, tkn.Token, nil
}

func (d *accountDomain) SignInByToken(ctx context.Context, req *models.Account) (*models.Account, string, error) {
	data, err := token.VerifyGoogleIDToken(req.Token)
	if err != nil {
		return nil, "", err
	}

	res, err := d.accountRepository.FindByEmail(ctx, data.Email)
	if err == errors.ErrEmailNotFound {
		req.Email = data.Email
		res, err = d.SignUp(ctx, req)
		if err != nil {
			return nil, "", err
		}
	}

	tkn, err := d.authenticator.Generate(&requestinfo.Info{
		AccountID: res.AccountID,
	})

	if err != nil {
		return nil, "", status.Errorf(codes.Internal, "gen token %w", err)
	}

	return res, tkn.Token, nil
}

func (d *accountDomain) CheckAuth(ctx context.Context, accountId string) (*models.Account, error) {
	res, err := d.accountRepository.FindByAccountId(ctx, accountId)
	if err != nil {
		return nil, err
	}

	return res, nil
}

func (d *accountDomain) UpdateInfo(ctx context.Context, accountId string, account *models.Account) (*models.Account, error) {
	if err := d.accountRepository.UpdateInfo(ctx, accountId, account); err != nil {
		return nil, err
	}

	res, err := d.accountRepository.FindByAccountId(ctx, accountId)
	if err != nil {
		return nil, err
	}

	return res, nil
}

func (d *accountDomain) GetAdminAccountList(ctx context.Context, offset, limit int64) ([]*models.Account, error) {
	res, err := d.accountRepository.GetAdminAccountList(ctx, offset, limit)
	if err != nil {
		return nil, err
	}

	return res, nil
}

func (d *accountDomain) GetAccountList(ctx context.Context, offset, limit int64) ([]*models.Account, error) {
	res, err := d.accountRepository.GetAccountList(ctx, offset, limit)
	if err != nil {
		return nil, err
	}

	return res, nil
}
