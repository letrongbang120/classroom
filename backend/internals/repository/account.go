package repository

import (
	"TKPM/internals/models"
	"context"

	"TKPM/common/enums"
	"TKPM/common/errors"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"gopkg.in/mgo.v2/bson"
)

type Account interface {
	Create(ctx context.Context, account *models.Account) (*models.Account, error)
	FindByEmail(ctx context.Context, email string) (*models.Account, error)
	FindByAccountId(ctx context.Context, accountId string) (*models.Account, error)
	UpdateInfo(ctx context.Context, accountId string, account *models.Account) error
	GetAccountList(ctx context.Context, offset, limit int64) ([]*models.Account, error)
	GetAdminAccountList(ctx context.Context, offset, limit int64) ([]*models.Account, error)
}

type accountRepository struct {
	coll *mongo.Collection
}

func NewAccountRepository(coll *mongo.Collection) Account {
	return &accountRepository{
		coll: coll,
	}
}

func (r *accountRepository) Create(ctx context.Context, account *models.Account) (*models.Account, error) {
	err := account.HashPassword()
	account.AccountID = uuid.New().String()
	if err != nil {
		return nil, err
	}

	_, err = r.coll.InsertOne(ctx, account)
	return account, err
}

func (r *accountRepository) FindByEmail(ctx context.Context, email string) (*models.Account, error) {
	result := models.Account{}
	err := r.coll.FindOne(ctx, bson.M{"email": email}).Decode(&result)
	if err == mongo.ErrNoDocuments {
		return nil, errors.ErrEmailNotFound
	}

	if err != nil {
		return nil, err
	}
	return &result, errors.ErrEmailExisted
}

func (r *accountRepository) FindByAccountId(ctx context.Context, accountId string) (*models.Account, error) {
	result := models.Account{}
	err := r.coll.FindOne(ctx, bson.M{"account_id": accountId}).Decode(&result)
	if err != nil {
		return nil, err
	}
	return &result, nil
}

func (r *accountRepository) UpdateInfo(ctx context.Context, accountId string, account *models.Account) error {
	_, err := r.coll.UpdateOne(ctx, bson.M{"account_id": accountId}, bson.M{
		"$set": account,
	})
	return err
}

func (r *accountRepository) GetAccountList(ctx context.Context, offset, limit int64) ([]*models.Account, error) {
	result := []*models.Account{}

	opt := options.FindOptions{
		Skip:  &offset,
		Limit: &limit,
	}
	cur, err := r.coll.Find(ctx, &models.Account{
		Role: enums.User.String(),
	}, &opt)

	if err != nil {
		return nil, err
	}

	if cur.Err() != nil {
		return nil, cur.Err()
	}

	if err := cur.All(ctx, &result); err != nil {
		return nil, err
	}

	return result, nil
}

func (r *accountRepository) GetAdminAccountList(ctx context.Context, offset, limit int64) ([]*models.Account, error) {
	result := []*models.Account{}

	opt := options.FindOptions{
		Skip:  &offset,
		Limit: &limit,
	}
	cur, err := r.coll.Find(ctx, &models.Account{
		Role: enums.Admin.String(),
	}, &opt)

	if err != nil {
		return nil, err
	}

	if cur.Err() != nil {
		return nil, cur.Err()
	}

	if err := cur.All(ctx, &result); err != nil {
		return nil, err
	}

	return result, nil
}
