import axios from "axios";

// ************* REGISTER USER **************/
export const registerUser = async (data) => {
  try {
    const response = await axios.post("/auth/register", data);

    if (response.status === 201) {
      const resData = await response.data;
      return resData;
    } else {
      throw new Error("Unexcepted Error Occurred!");
    }
  } catch (err) {
    throw err;
  }
};

// ************* LOGIN USER **************/
export const loginUser = async (data) => {
  try {
    const response = await axios.post("/auth/login", data);

    if (response.status === 200) {
      const resData = await response.data;
      return resData;
    } else {
      throw new Error("Unexcepted Error Occurred!");
    }
  } catch (err) {
    throw err;
  }
};

// ************* GET USER INFO **************/
export const getUserInfo = async () => {
  try {
    const response = await axios.post(
      "/auth/get-user-info",
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.status === 200) {
      const resData = await response.data;
      return resData;
    } else {
      throw new Error("Unexcepted Error Occurred!");
    }
  } catch (err) {
    throw err;
  }
};