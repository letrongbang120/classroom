package repository

import (
	"TKPM/internals/models"
	"context"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"gopkg.in/mgo.v2/bson"
)

type Assignment interface {
	Create(ctx context.Context, Assignment *models.Assignment) (*models.Assignment, error)
	Update(ctx context.Context, Assignment *models.Assignment) (*models.Assignment, error)
	GetAssignmentList(ctx context.Context, offset, limit int64) ([]*models.Assignment, error)
	GetAssignmentById(ctx context.Context, AssignmentId string) (*models.Assignment, error)
	GetAssignmentByClassId(ctx context.Context, classId string) ([]*models.Assignment, error)
}

type AssignmentRepository struct {
	coll *mongo.Collection
}

func NewAssignmentRepository(coll *mongo.Collection) Assignment {
	return &AssignmentRepository{
		coll: coll,
	}
}

func (r *AssignmentRepository) Create(ctx context.Context, Assignment *models.Assignment) (*models.Assignment, error) {
	Assignment.AssignmentID = uuid.New().String()
	_, err := r.coll.InsertOne(ctx, Assignment)
	return Assignment, err
}

func (r *AssignmentRepository) Update(ctx context.Context, Assignment *models.Assignment) (*models.Assignment, error) {
	after := options.After
	res := r.coll.FindOneAndUpdate(ctx, bson.M{"assignment_id": Assignment.AssignmentID}, bson.M{
		"$set": Assignment,
	}, &options.FindOneAndUpdateOptions{
		ReturnDocument: &after,
	})
	if res.Err() != nil {
		return nil, res.Err()
	}

	var updatedAssignment models.Assignment
	err := res.Decode(&updatedAssignment)
	if err != nil {
		return nil, err
	}

	return &updatedAssignment, nil
}

func (r *AssignmentRepository) GetAssignmentList(ctx context.Context, offset, limit int64) ([]*models.Assignment, error) {
	result := []*models.Assignment{}

	opt := options.FindOptions{
		Skip:  &offset,
		Limit: &limit,
	}
	cur, err := r.coll.Find(ctx, &models.Assignment{}, &opt)

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

func (r *AssignmentRepository) GetAssignmentById(ctx context.Context, AssignmentId string) (*models.Assignment, error) {
	var Assignment models.Assignment
	err := r.coll.FindOne(ctx, bson.M{"assignment_id": AssignmentId}).Decode(&Assignment)
	if err != nil {
		return nil, err
	}

	return &Assignment, nil
}

func (r *AssignmentRepository) GetAssignmentByClassId(ctx context.Context, classId string) ([]*models.Assignment, error) {
	result := []*models.Assignment{}

	cur, err := r.coll.Find(ctx, &models.Assignment{
		ClassID: classId,
	})

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
