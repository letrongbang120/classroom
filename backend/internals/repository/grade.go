package repository

import (
	"TKPM/internals/models"
	"context"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"gopkg.in/mgo.v2/bson"
)

type Grade interface {
	Create(ctx context.Context, Grade *models.Grade) (*models.Grade, error)
	Update(ctx context.Context, Grade *models.Grade) (*models.Grade, error)
	GetGradeList(ctx context.Context, offset, limit int64) ([]*models.Grade, error)
	GetGradeById(ctx context.Context, assignmentId, studentId string) (*models.Grade, error)
	GetGradeOfStudent(ctx context.Context, accountId string) ([]*models.Grade, error)
}

type GradeRepository struct {
	coll *mongo.Collection
}

func NewGradeRepository(coll *mongo.Collection) Grade {
	return &GradeRepository{
		coll: coll,
	}
}

func (r *GradeRepository) Create(ctx context.Context, grade *models.Grade) (*models.Grade, error) {
	_, err := r.coll.InsertOne(ctx, grade)
	return grade, err
}

func (r *GradeRepository) Update(ctx context.Context, grade *models.Grade) (*models.Grade, error) {
	after := options.After
	res := r.coll.FindOneAndUpdate(ctx, bson.M{"assignment_id": grade.AssignmentID, "student_id": grade.StudentID}, bson.M{
		"$set": grade,
	}, &options.FindOneAndUpdateOptions{
		ReturnDocument: &after,
	})
	if res.Err() != nil {
		return nil, res.Err()
	}

	var updatedGrade models.Grade
	err := res.Decode(&updatedGrade)
	if err != nil {
		return nil, err
	}

	return &updatedGrade, nil
}

func (r *GradeRepository) GetGradeList(ctx context.Context, offset, limit int64) ([]*models.Grade, error) {
	result := []*models.Grade{}

	opt := options.FindOptions{
		Skip:  &offset,
		Limit: &limit,
	}
	cur, err := r.coll.Find(ctx, &models.Grade{}, &opt)

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

func (r *GradeRepository) GetGradeOfStudent(ctx context.Context, accountId string) ([]*models.Grade, error) {
	result := []*models.Grade{}

	opt := options.FindOptions{}
	cur, err := r.coll.Find(ctx, &models.Grade{
		AccountID: accountId,
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

func (r *GradeRepository) GetGradeById(ctx context.Context, assignmentId, studentId string) (*models.Grade, error) {
	var Grade models.Grade
	err := r.coll.FindOne(ctx, bson.M{"assignment_id": assignmentId, "student_id": studentId}).Decode(&Grade)
	if err != nil {
		return nil, err
	}

	return &Grade, nil
}
