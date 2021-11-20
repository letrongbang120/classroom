package models

const ClassCollection = "class"

type Class struct {
	ClassID     string   `json:"classId,omitempty" bson:"class_id,omitempty"`
	Name        string   `json:"name,omitempty" bson:"name,omitempty"`
	Room        string   `json:"room,omitempty" bson:"room,omitempty"`
	Theme       string   `json:"theme,omitempty" bson:"theme,omitempty"`
	Description string   `json:"description,omitempty" bson:"description,omitempty"`
	StudentIDs  []string `json:"studentIds,omitempty" bson:"student_ids,omitempty"`
	TeacherID   string   `json:"teacherId,omitempty" bson:"teacher_id,omitempty"`
}

type JoinClassRequest struct {
	ClassID   string `json:"classId,omitempty" bson:"class_id,omitempty"`
}
