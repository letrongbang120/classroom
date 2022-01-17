import axios from 'axios'

export const createReview = async (assignmentId, composition, accountId, studentId, fullName, updatedPoint, currentPoint, expectPoint, comments, token) => {
  try {
    console.log(assignmentId, composition, accountId, studentId, fullName, updatedPoint, currentPoint, expectPoint, comments, token)
    const { data } = await axios.post("/review", { assignmentId, composition, accountId, studentId, fullName, updatedPoint, currentPoint, expectPoint, comments }, {
      headers: { Authorization: token }
    });
    return data;
  } catch (error) {
    return false;
  }
};

export const getReviewList = async (token) => {
  try {
    const { data } = await axios.get("/review/list", {
      headers: { Authorization: token }
    });
    return data;
  } catch (error) {
    return false;
  }
}