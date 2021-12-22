import axios from "axios"

export const createClass = async (room, name, teacherId, theme, description, token) => {
  try {
    const { data } = await axios.post("/class", { room, name, teacherId, theme, description }, {
      headers: { Authorization: token }
    });
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
    return data;
  } catch (error) {
    return false;
  }
}

export const createLink = async (classId, token) => {
  try {
    const { data } = await axios.post("/invitation", { classId }, {
      headers: { Authorization: token }
    });
    return data.link;
  } catch (error) {
    return "Create link fail"
  }
}

export const joinClass = async (classId, token) => {
  try {
    const { data } = await axios.post("/class/join", { classId }, {
      headers: { Authorization: token }
    });
    return data;
  } catch (error) {
    return false;
  }
}

export const inviteByEmail = async (emailList, classId, token) => {
  try {
    const { data } = await axios.post('/invitation/mail', { emailList, classId }, {
      headers: { Authorization: token }
    });
    console.log(data)
    return true;
  } catch (error) {
    return false;
  }
}

export const updateClass = async (classId, name, description, theme, room, token) => {
  try {
    const { data } = await axios.put("/class", { classId, name, description, theme, room }, {
      headers: { Authorization: token }
    })
    console.log(data);
    return true;
  } catch (error) {
    return false;
  }
}