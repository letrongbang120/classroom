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

export const signInByEmail = async (token) => {
  try {
    const { data } = await axios.post("/sign-in/token", { token });
    console.log(data);
    return data;
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

export const updateUser = async (username, studentId, phone, age, token) => {
  try {
    const ageNumber = Number(age);
    const { data } = await axios.put("/account", { username, studentId, phone, age: ageNumber }, {
      headers: { Authorization: token }
    });
    localStorage.setItem("userSigninClassroom", JSON.stringify({
      accountId: data.accountId,
      age: data.age,
      email: data.email,
      phone: data.phone,
      role: data.role,
      studentId: data.studentId,
      token: token,
      username: data.username
    }));
    return true;
  } catch (error) {
    return false;
  }
}