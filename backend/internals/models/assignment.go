package models

const AssignmentCollection = "assignment"

type Assignment struct {
	AssignmentID  string `json:"assignmentId,omitempty" bson:"assignment_id,omitempty"`
	ScoreQuantity int    `json:"scoreQuantity,omitempty" bson:"score_quantity,omitempty"`
	Description   string `json:"description,omitempty" bson:"description,omitempty"`
}
