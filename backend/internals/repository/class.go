package repository

import (
	"TKPM/internals/models"
	"context"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"gopkg.in/mgo.v2/bson"
)

type Class interface {
	Create(ctx context.Context, class *models.Class) (*models.Class, error)
	Update(ctx context.Context, class *models.Class) (*models.Class, error)
	GetClassList(ctx context.Context, offset, limit int64) ([]*models.Class, error)
	GetClassById(ctx context.Context, classId string) (*models.Class, error)
	GetClassByAccountID(ctx context.Context, accountID string) ([]*models.Class, error)
}

type ClassRepository struct {
	coll *mongo.Collection
}

func NewClassRepository(coll *mongo.Collection) Class {
	return &ClassRepository{
		coll: coll,
	}
}

func (r *ClassRepository) Create(ctx context.Context, class *models.Class) (*models.Class, error) {
	class.ClassID = uuid.New().String()
	_, err := r.coll.InsertOne(ctx, class)
	return class, err
}

func (r *ClassRepository) Update(ctx context.Context, class *models.Class) (*models.Class, error) {
	after := options.After
	res := r.coll.FindOneAndUpdate(ctx, bson.M{"class_id": class.ClassID}, bson.M{
		"$set": class,
	}, &options.FindOneAndUpdateOptions{
		ReturnDocument: &after,
	})
	if res.Err() != nil {
		return nil, res.Err()
	}

	var updatedClass models.Class
	err := res.Decode(&updatedClass)
	if err != nil {
		return nil, err
	}

	return &updatedClass, nil
}

func (r *ClassRepository) GetClassList(ctx context.Context, offset, limit int64) ([]*models.Class, error) {
	result := []*models.Class{}

	opt := options.FindOptions{
		Skip:  &offset,
		Limit: &limit,
	}
	cur, err := r.coll.Find(ctx, &models.Class{}, &opt)

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

func (r *ClassRepository) GetClassById(ctx context.Context, classId string) (*models.Class, error) {
	var class models.Class
	err := r.coll.FindOne(ctx, bson.M{"class_id": classId}).Decode(&class)
	if err != nil {
		return nil, err
	}

	return &class, nil
}

func (r *ClassRepository) GetClassByAccountID(ctx context.Context, accountID string) ([]*models.Class, error) {
	result := []*models.Class{}

	query := bson.M{
		"$or": []bson.M{
			{
				"teacher_id": accountID,
			},
			{
				"student_ids": bson.M{
					"$in": []string{accountID},
				},
			},
		},
	}

	cur, err := r.coll.Find(ctx, query)

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
