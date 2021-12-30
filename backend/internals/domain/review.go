package domain

import (
	"TKPM/internals/models"
	"TKPM/internals/repository"
	"context"
)

type Review interface {
	Create(ctx context.Context, review *models.Review) (*models.Review, error)
	Update(ctx context.Context, review *models.Review) (*models.Review, error)
	GetReviewList(ctx context.Context, offset, limit int64) ([]*models.Review, error)
	GetReviewById(ctx context.Context, ReviewId string) (*models.Review, error)
	GetReviewByAssignmentId(ctx context.Context, ReviewId string) ([]*models.Review, error)
}

type reviewDomain struct {
	ReviewRepository repository.Review
}

func NewReviewDomain(reviewRepository repository.Review) Review {
	return &reviewDomain{
		ReviewRepository: reviewRepository,
	}
}

func (d *reviewDomain) Create(ctx context.Context, review *models.Review) (*models.Review, error) {
	res, err := d.ReviewRepository.Create(ctx, review)
	if err != nil {
		return nil, err
	}

	return res, nil
}

func (d *reviewDomain) Update(ctx context.Context, review *models.Review) (*models.Review, error) {
	res, err := d.ReviewRepository.Update(ctx, review)
	if err != nil {
		return nil, err
	}

	return res, nil
}

func (d *reviewDomain) GetReviewList(ctx context.Context, offset, limit int64) ([]*models.Review, error) {
	res, err := d.ReviewRepository.GetReviewList(ctx, offset, limit)
	if err != nil {
		return nil, err
	}

	return res, nil
}

func (d *reviewDomain) GetReviewById(ctx context.Context, reviewId string) (*models.Review, error) {
	res, err := d.ReviewRepository.GetReviewById(ctx, reviewId)
	if err != nil {
		return nil, err
	}

	return res, nil
}

func (d *reviewDomain) GetReviewByAssignmentId(ctx context.Context, assignmentId string) ([]*models.Review, error) {
	res, err := d.ReviewRepository.GetReviewByAssignmentId(ctx, assignmentId)
	if err != nil {
		return nil, err
	}

	return res, nil
}
