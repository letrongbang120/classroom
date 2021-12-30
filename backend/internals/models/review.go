package models

const ReviewCollection = "review"

type Comment struct {
	Content   string `json:"content,omitempty" bson:"content,omitempty"`
	AccountID string `json:"accountId,omitempty" bson:"account_id,omitempty"`
}

type Review struct {
	ReviewID     string    `json:"reviewId,omitempty" bson:"review_id,omitempty"`
	AccountID    string    `json:"accountId,omitempty" bson:"account_id,omitempty"`
	StudentID    string    `json:"studentId,omitempty" bson:"student_id,omitempty"`
	Fullname     string    `json:"fullName,omitempty" bson:"full_name,omitempty"`
	AssignmentID string    `json:"assignmentId,omitempty" bson:"assignment_id,omitempty"`
	Done         bool      `json:"done,omitempty" bson:"done,omitempty"`
	UpdatedPoint float32   `json:"updatedPoint,omitempty" bson:"updated_point,omitempty"`
	CurrentPoint float32   `json:"currentPoint,omitempty" bson:"current_point,omitempty"`
	ExpectPoint  float32   `json:"expectPoint,omitempty" bson:"expect_point,omitempty"`
	Composition  int       `json:"composition,omitempty" bson:"composition,omitempty"`
	Comments     []Comment `json:"comments,omitempty" bson:"comments,omitempty"`
}
