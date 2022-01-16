package models

const AssignmentCollection = "assignment"

type Assignment struct {
	AssignmentID string  `json:"assignmentId,omitempty" bson:"assignment_id,omitempty"`
	ClassID      string  `json:"classId,omitempty" bson:"class_id,omitempty"`
	Scores       []Score `json:"scores,omitempty" bson:"scores,omitempty"`
	Description  string  `json:"description,omitempty" bson:"description,omitempty"`
}
