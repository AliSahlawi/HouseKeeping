import axios from "axios";

// ************* Add New Worker ******************/
export const addNewWorker = async (data) => {
    try {
      const response = await axios.post("/admin/add-worker", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
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
// ************* Add New Worker ******************/
export const addNewCustomer = async (data) => {
    try {
      const response = await axios.post("/admin/add-customer", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
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

  // ********** GET ALL Workers ***********/
export const getAllWorkers = async () => {
    try {
      const response = await axios.get("/admin/getAllWorkers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
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
  
  // ********** GET ALL Appointments ***********/
  export const getAllAppointments = async () => {
    try {
      const response = await axios.get("/admin/getAllAppointments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
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
  // ********** GET ALL Appointments ***********/
  export const getAllContracts = async () => {
    try {
      const response = await axios.get("/admin/getAllContracts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
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
  // ********** GET ALL Appointments ***********/
  export const getAppointmentsByContract = async (contractId) => {
    try {
      const response = await axios.post("/admin/getAppointmentByContract", contractId, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
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
  
  export const getPriceByContract = async (contractId) => {
    try {
      const response = await axios.post("/admin/getPriceByContract", contractId, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
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



  // ********** GET ALL Activer WORKERS ***********/
export const getAllActiveWorkers = async () => {
    try {
      const response = await axios.get("/auth/getAllActiveWorkers");
  
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


  // ********** CHANGE Booking  STATUS ***********/
export const changeBookingStatus = async (bookingId, status) => {
    try {
      const response = await axios.post(
        "/auth/changeBookingStatus",
        { bookingId, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
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

  // ********** CHANGE Booking  STATUS ***********/
export const changeContractStatus = async (contractId, status) => {
    try {
      const response = await axios.post(
        "/auth/changeContractStatus",
        { contractId, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
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


  export const getAppointmentsForRange = async(startDate, endDate) => {
    try {
      const response = await axios.post("/admin/getAppointmentInRange", {startDate,endDate},  {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

    if (response.status === 200) {
        const resData = await response.data;
        return resData;
      } else {
        throw new Error("Unexcepted Error Occurred!");
      }
    } catch (err) {
      throw err;
    }
  }