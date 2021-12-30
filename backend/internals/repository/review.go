package repository

import (
	"TKPM/internals/models"
	"context"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"gopkg.in/mgo.v2/bson"
)

type Review interface {
	Create(ctx context.Context, Review *models.Review) (*models.Review, error)
	Update(ctx context.Context, Review *models.Review) (*models.Review, error)
	GetReviewList(ctx context.Context, offset, limit int64) ([]*models.Review, error)
	GetReviewById(ctx context.Context, reviewId string) (*models.Review, error)
	GetReviewByAssignmentId(ctx context.Context, assignmentId string) ([]*models.Review, error)
}

type reviewRepository struct {
	coll *mongo.Collection
}

func NewReviewRepository(coll *mongo.Collection) Review {
	return &reviewRepository{
		coll: coll,
	}
}

func (r *reviewRepository) Create(ctx context.Context, review *models.Review) (*models.Review, error) {
	review.ReviewID = uuid.New().String()
	_, err := r.coll.InsertOne(ctx, review)
	return review, err
}

func (r *reviewRepository) Update(ctx context.Context, review *models.Review) (*models.Review, error) {
	after := options.After
	res := r.coll.FindOneAndUpdate(ctx, bson.M{"review_id": review.ReviewID}, bson.M{
		"$set": review,
	}, &options.FindOneAndUpdateOptions{
		ReturnDocument: &after,
	})
	if res.Err() != nil {
		return nil, res.Err()
	}

	var updatedReview models.Review
	err := res.Decode(&updatedReview)
	if err != nil {
		return nil, err
	}

	return &updatedReview, nil
}

func (r *reviewRepository) GetReviewList(ctx context.Context, offset, limit int64) ([]*models.Review, error) {
	result := []*models.Review{}

	opt := options.FindOptions{
		Skip:  &offset,
		Limit: &limit,
	}
	cur, err := r.coll.Find(ctx, &models.Review{}, &opt)

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

func (r *reviewRepository) GetReviewById(ctx context.Context, reviewId string) (*models.Review, error) {
	var review models.Review
	err := r.coll.FindOne(ctx, bson.M{"review_id": reviewId}).Decode(&review)
	if err != nil {
		return nil, err
	}

	return &review, nil
}

func (r *reviewRepository) GetReviewByAssignmentId(ctx context.Context, assignmentId string) ([]*models.Review, error) {
	result := []*models.Review{}

	opt := options.FindOptions{}
	cur, err := r.coll.Find(ctx, &models.Review{
		AssignmentID: assignmentId,
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
