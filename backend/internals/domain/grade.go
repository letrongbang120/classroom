package domain

import (
	"TKPM/common/core"
	"TKPM/internals/models"
	"TKPM/internals/repository"
	"context"
	"strconv"
)

type Grade interface {
	Create(ctx context.Context, Grade *models.Grade) (*models.Grade, error)
	Update(ctx context.Context, Grade *models.Grade) (*models.Grade, error)
	GetGradeList(ctx context.Context, offset, limit int64) ([]*models.Grade, error)
	GetGradeById(ctx context.Context, assignmentId, studentId string) (*models.Grade, error)
	GetGradeOfStudent(ctx context.Context, accountId string) ([]*models.Grade, error)
	UploadGradeList(ctx context.Context, data [][]string, assignmentId string) error
}

type GradeDomain struct {
	GradeRepository repository.Grade
}

func NewGradeDomain(GradeRepository repository.Grade) Grade {
	return &GradeDomain{
		GradeRepository: GradeRepository,
	}
}

func (d *GradeDomain) Create(ctx context.Context, Grade *models.Grade) (*models.Grade, error) {
	res, err := d.GradeRepository.Create(ctx, Grade)
	if err != nil {
		return nil, err
	}

	return res, nil
}

func (d *GradeDomain) UploadGradeList(ctx context.Context, data [][]string, assignmentId string) error {
	data = data[1:]
	for _, v := range data {
		scores := make([]float32, 0)
		for _, score := range v[1:] {
			f, err := strconv.ParseFloat(score, 32)
			if err != nil {
				return err
			}
			scores = append(scores, float32(f))
		}
		if _, err := d.Create(ctx, &models.Grade{
			AccountID:    core.GetAccountID(v[0]),
			StudentID:    v[0],
			Fullname:     core.GetFullname(v[0]),
			Scores:       scores,
			AssignmentID: assignmentId,
		}); err != nil {
			return err
		}
	}
	return nil
}

func (d *GradeDomain) Update(ctx context.Context, Grade *models.Grade) (*models.Grade, error) {
	res, err := d.GradeRepository.Update(ctx, Grade)
	if err != nil {
		return nil, err
	}

	return res, nil
}

func (d *GradeDomain) GetGradeList(ctx context.Context, offset, limit int64) ([]*models.Grade, error) {
	res, err := d.GradeRepository.GetGradeList(ctx, offset, limit)
	if err != nil {
		return nil, err
	}

	return res, nil
}

func (d *GradeDomain) GetGradeById(ctx context.Context, assignmentId, studentId string) (*models.Grade, error) {
	res, err := d.GradeRepository.GetGradeById(ctx, assignmentId, studentId)
	if err != nil {
		return nil, err
	}

	return res, nil
}

func (d *GradeDomain) GetGradeOfStudent(ctx context.Context, accountId string) ([]*models.Grade, error) {
	res, err := d.GradeRepository.GetGradeOfStudent(ctx, accountId)
	if err != nil {
		return nil, err
	}

	return res, nil
}
