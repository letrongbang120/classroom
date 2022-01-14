import axios from 'axios';

export const createAdmin = async (admin, token) => {
  try {
    const { data } = await axios.post("/sign-up/admin", {
      email: admin.email,
      password: admin.password,
      studentId: admin.studentId,
      phone: admin.phone,
      age: Number(admin.age)
    }, {
      headers: { Authorization: token }
    });
    console.log(data);
    return data;
  } catch (error) {
    return false;
  }
}

export const getListAdmin = async (token) => {
  try {
    const { data } = await axios.get("/accounts/admin", {
      headers: { Authorization: token }
    });
    return data;
  } catch (error) {
    return false;
  }
}
