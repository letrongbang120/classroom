import axios from 'axios'

export const getListUser = async () => {
  try {
    const { data } = await axios.get("/accounts");
    return data;
  } catch (error) {
    return false;
  }
}