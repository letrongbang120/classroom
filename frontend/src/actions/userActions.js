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

export const userRegister = async (email, password, studentId, phone, age) => {
  try {
    const ageNumber = Number(age);
    const { data } = await axios.post("/sign-up", { email, password, studentId, phone, age: ageNumber });
    console.log(data);
    return true;
  } catch (error) {
    return false;
  }
}