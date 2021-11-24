import axios from 'axios'

export const signin = async (email, password) => {
  try {
    const { data } = await axios.post("/sign-in", { email, password });
    localStorage.setItem("userSigninClassroom", JSON.stringify(data));
    return true;
  } catch (error) {
    return false;
  }
}

export const userRegister = async (username, email, password, studentId, phone, age) => {
  try {
    const ageNumber = Number(age);
    const { data } = await axios.post("/sign-up", { username, email, password, studentId, phone, age: ageNumber });
    console.log(data);
    return true;
  } catch (error) {
    return false;
  }
}

export const signout = () => {
  localStorage.removeItem("userSigninClassroom");
}

export const getUserById = async (userId) => {
  try {
    const { data } = await axios.get(`/account?accountId=${userId}`);
    console.log(data);
    return data;
  } catch (error) {
    return false;
  }
}

export const getClassById = async (accountId, token) => {
  try {
    const { data } = await axios.get(`/class/me?accountId=${accountId}`, {
      headers: { Authorization: token }
    });
    return data;
  } catch (error) {
    return false;
  }
}