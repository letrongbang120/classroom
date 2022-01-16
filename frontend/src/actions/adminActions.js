import axios from 'axios'

export const getListUser = async () => {
  try {
    const { data } = await axios.get("/accounts");
    return data;
  } catch (error) {
    return false;
  }
}

export const getListClass = async (token) => {
  try {
    const { data } = await axios.get("/class/list", {
      headers: { Authorization: token }
    });
    return data;
  } catch (error) {
    return false;
  }
}