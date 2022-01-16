package domain

import (
	"TKPM/internals/models"
	"TKPM/internals/repository"
	"context"
)

type Assignment interface {
	Create(ctx context.Context, Assignment *models.Assignment) (*models.Assignment, error)
	Update(ctx context.Context, Assignment *models.Assignment) (*models.Assignment, error)
	GetAssignmentList(ctx context.Context, offset, limit int64) ([]*models.Assignment, error)
	GetAssignmentById(ctx context.Context, AssignmentId string) (*models.Assignment, error)
	GetAssignmentByClassId(ctx context.Context, classId string) ([]*models.Assignment, error)
}

type assignmentDomain struct {
	assignmentRepository repository.Assignment
}

func NewAssignmentDomain(AssignmentRepository repository.Assignment) Assignment {
	return &assignmentDomain{
		assignmentRepository: AssignmentRepository,
	}
}

func (d *assignmentDomain) Create(ctx context.Context, Assignment *models.Assignment) (*models.Assignment, error) {
	res, err := d.assignmentRepository.Create(ctx, Assignment)
	if err != nil {
		return nil, err
	}

	return res, nil
}

func (d *assignmentDomain) Update(ctx context.Context, Assignment *models.Assignment) (*models.Assignment, error) {
	res, err := d.assignmentRepository.Update(ctx, Assignment)
	if err != nil {
		return nil, err
	}

	return res, nil
}

func (d *assignmentDomain) GetAssignmentList(ctx context.Context, offset, limit int64) ([]*models.Assignment, error) {
	res, err := d.assignmentRepository.GetAssignmentList(ctx, offset, limit)
	if err != nil {
		return nil, err
	}

	return res, nil
}

func (d *assignmentDomain) GetAssignmentById(ctx context.Context, AssignmentId string) (*models.Assignment, error) {
	res, err := d.assignmentRepository.GetAssignmentById(ctx, AssignmentId)
	if err != nil {
		return nil, err
	}

	return res, nil
}

func (d *assignmentDomain) GetAssignmentByClassId(ctx context.Context, classId string) ([]*models.Assignment, error) {
	res, err := d.assignmentRepository.GetAssignmentByClassId(ctx, classId)
	if err != nil {
		return nil, err
	}

	return res, nil
}
