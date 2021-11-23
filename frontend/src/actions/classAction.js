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

export const getClass = async (id) => {
  try {
    const { data } = await axios.get(`/class?classId=${id}`);
    console.log(data);
    return data;
  } catch (error) {
    return false;
  }
}