import axios from "axios"

export const createAssignment = async (description, scores, classId, token) => {
  try {
    const { data } = await axios.post("/assignment", { scores, description, classId }, {
      headers: { Authorization: token }
    });
    return data;
  } catch (error) {
    return false;
  }
}

export const getAssignmentList = async (token) => {
  try {
    const { data } = await axios.get("/assignment/list", {
      headers: { Authorization: token }
    });
    return data;
  } catch (error) {
    return false;
  }
}

export const getAssignmentById = async (assignmentId, token) => {
  try {
    const { data } = await axios.get(`/assignment/detail?assignmentId=${assignmentId}`, {
      headers: { Authorization: token }
    });
    return data;
  } catch (error) {
    return false;
  }
}

export const getAssignmentByClassId = async (classId, token) => {
  try {
    const { data } = await axios.get(`/assignment/classId?classId=${classId}`, {
      headers: { Authorization: token }
    });
    return data[0];
  } catch (error) {
    return false;
  }
}

export const uploadGradeList = async (assignmentId, gradeFile, token) => {
  try {
    const { data } = await axios.post(`/grade/upload/${assignmentId}`, gradeFile, {
      headers: { Authorization: token }
    });
    return data;
  } catch (error) {
    return false;
  }
}

export const getGradeList = async (token) => {
  try {
    const { data } = await axios.get("/grade/list", {
      headers: { Authorization: token }
    });
    return data;
  } catch (error) {
    return false;
  }
}

export const createGrade = async (studentId, assignmentId, accountId, scores, done, token) => {
  try {
    const { data } = await axios.post("/grade", { studentId, assignmentId, accountId, scores, done }, {
      headers: { Authorization: token }
    });
    return data;
  } catch (error) {
    return false;
  }
}

export const updateDoneGrade = async (studentId, assignmentId, accountId, scores, done, token) => {
  try {
    const { data } = await axios.put("/grade", { studentId, assignmentId, accountId, scores, done }, {
      headers: { Authorization: token }
    });
    return data;
  } catch (error) {
    return false;
  }
}

export const getGrade = async (assignmentId, studentId, token) => {
  try {
    const { data } = await axios.get(`/grade/detail?assignmentId=${assignmentId}&studentId=${studentId}`, {
      headers: { Authorization: token }
    });
    return data;
  } catch (error) {
    return false;
  }
}