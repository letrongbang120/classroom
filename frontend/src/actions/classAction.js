import axios from "axios"

export const createClass = async (room, name, teacherId, theme, description) => {
  try {
    const { data } = await axios.post("/class", { room, name, teacherId, theme, description });
    console.log(data);
    return data;
  } catch (error) {
    return false;
  }
}

export const getClass = async (id, token) => {
  try {
    const { data } = await axios.get(`/class?classId=${id}`, {
      headers: { Authorization: token }
    });
    console.log(data);
    return data;
  } catch (error) {
    return false;
  }
}