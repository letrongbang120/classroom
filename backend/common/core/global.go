package core

var mapAccountStudent = make(map[string]string)
var mapFullnameStudent = make(map[string]string)

func SetMapAccountStudent(accountId, studentId string) {
	mapAccountStudent[accountId], mapAccountStudent[studentId] = studentId, accountId
}

func SetMapFullnameStudent(fullName, studentId string) {
	mapFullnameStudent[studentId] = fullName
}

func GetStudentID(accountId string) string {
	if v, ok := mapAccountStudent[accountId]; ok {
		return v
	}
	return ""
}

func GetFullname(studentId string) string {
	if v, ok := mapFullnameStudent[studentId]; ok {
		return v
	}
	return ""
}

func GetAccountID(studentId string) string {
	if v, ok := mapAccountStudent[studentId]; ok {
		return v
	}
	return ""
}
