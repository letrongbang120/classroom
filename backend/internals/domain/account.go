package domain

import (
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
	SignIn(ctx context.Context, req *models.Account) (*models.Account, string, error)
	UpdateInfo(ctx context.Context, accountId string, req *models.Account) (*models.Account, error)
	CheckAuth(ctx context.Context, accountId string) (*models.Account, error)
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
