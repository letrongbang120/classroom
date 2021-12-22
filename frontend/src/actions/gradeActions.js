import axios from "axios"

export const createAssignment = async (description, scoreQuantity, token) => {
  try {
    const { data } = await axios.post("/assignment", { description, scoreQuantity }, {
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

export const uploadGradeList = async (assignmentId, gradeFile, token) => {
  try {
    console.log(assignmentId)
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