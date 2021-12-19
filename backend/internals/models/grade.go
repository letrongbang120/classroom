package models

const GradeCollection = "grade"

type Grade struct {
	AccountID    string    `json:"accountId,omitempty" bson:"account_id,omitempty"`
	StudentID    string    `json:"studentId,omitempty" bson:"student_id,omitempty"`
	Fullname     string    `json:"fullName,omitempty" bson:"full_name,omitempty"`
	Scores       []float32 `json:"scores,omitempty" bson:"scores,omitempty"`
	AssignmentID string    `json:"assignmentId,omitempty" bson:"assignment_id,omitempty"`
}
