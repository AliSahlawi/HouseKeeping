import UserModel from "../Models/UserModel.js";
import BookingModel from "../Models/BookingModel.js";
import WorkerModel from "../Models/WorkerModel.js";
import CustomerModel from "../Models/CustomerModel.js";
import ContractModel from "../Models/ContractModel.js";

//************* GET ALL USER **********/
export const getAllUser = async (req, res, next) => {
  try {
    const users = await UserModel.find({}, { password: 0 }); //Hide password field

    //Success res
    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
      error: err.message,
    });
  }
};

//**************** GET ALL Appointments *************/
export const getAllAppointments = async (req, res, next) => {
  try {
    const bookings = await BookingModel.find({})
    .populate("workerInfo")
    .populate("customerInfo");

    //Success Res
    return res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
      error: err.message,
    });
  }
};
//************** GET worker BY ID *************/
export const getWorkerById = async (req, res) => {
  try {
    const worker = await WorkerModel.findOne({ _id: req.body.workerId });
    //Validation
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "worker not found.",
      });
    }

    //success
    return res.status(200).json({
      success: true,
      message: "Worker get by id successfully!",
      data: worker,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
      error: err.message,
    });
  }
};
//************** GET Appointment BY Contranct *************/
export const getAppointmentByContract = async (req, res) => {
  try {

    const appointments = await BookingModel.find({ contractId: req.body.contractId })
    .populate("workerInfo")
    .populate("customerInfo");
    //Validation
    if (!appointments) {
      return res.status(404).json({
        success: false,
        message: "appointments not found.",
      });
    }

    //success
    return res.status(200).json({
      success: true,
      message: "appointments get by Contract successfully!",
      data: appointments,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
      error: err.message,
    });
  }
};

export const getPriceForContract = async (req, res) => {
  try {

    const appointments = await BookingModel.find({ contractId: req.body.contractId })
    .populate("workerInfo")
    .populate("customerInfo");
    //Validation
    if (!appointments) {
      return res.status(404).json({
        success: false,
        message: "appointments not found.",
      });
    }

    let price = 0;
    appointments.forEach(appintment => {
      if(appintment.status == "approved"){
        price+= appintment.price;
      }
    });
    //success
    return res.status(200).json({
      success: true,
      message: "price get by Contract successfully!",
      data: price,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
      error: err.message,
    });
  }
};
//************** GET Appointment In Range*************/
export const getAppointmentInRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    const appointments = await BookingModel.find({
      date: { $gte: startDate, $lte: endDate }
    })
      .populate("workerInfo")
      .populate("customerInfo");

    // Validation
    if (!appointments || appointments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Appointments for this Period, Please Add Appointments to show."
      });
    }

    // Success
    return res.status(200).json({
      success: true,
      message: "Appointments retrieved successfully!",
      data: appointments
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
      error: err.message
    });
  }
};

//**************** GET ALL Workers *************/
export const getAllWorkers = async (req, res, next) => {
  try {
    const workers = await WorkerModel.find({});

    //Success Res
    return res.status(200).json({
      success: true,
      data: workers,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
      error: err.message,
    });
  }
};
//**************** GET ALL Customers *************/
export const getAllCustomers = async (req, res, next) => {
  try {
    const customers = await CustomerModel.find({});

    //Success Res
    return res.status(200).json({
      success: true,
      data: customers,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
      error: err.message,
    });
  }
};
//**************** GET ALL Contracts *************/
export const getAllContracts = async (req, res, next) => {
  try {
    const contracts = await ContractModel.find({})
      .populate("workerInfo")
      .populate("customerInfo");

    console.log("getAllContracts");

    // Use Promise.all with map to handle asynchronous operations properly
    const updatedContracts = await Promise.all(contracts.map(async contract => {
      const appointments = await BookingModel.find({ contractId: contract.contractId })
        .populate("workerInfo")
        .populate("customerInfo");

      let price = 0;
      appointments.forEach(appointment => {
        if (appointment.status === "approved") {
          price += appointment.price;
        }
      });

      console.log("price for " + contract.id + " is " + price);
      // Update contract with price
      contract.price = price.toString();
      return contract;
    }));

    console.log("finished calculating " + JSON.stringify(updatedContracts));

    // Success Response
    return res.status(200).json({
      success: true,
      data: updatedContracts,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
      error: err.message,
    });
  }
};



//**************** Add New Worker *************/
export const addWorker = async (req, res, next) => {
  try {
        //Add worker
        const newWorker = new WorkerModel(req.body);
        await newWorker.save();
      
    
        //Response
        return res.status(201).json({
          message: "Worker has been added Successfully!",
          success: true,
        });
      } catch (err) {
        console.log(err)
        return res.status(500).json({
          message: "Internal Server Error!",
          success: false,
          error: err.message,
        });
      }
  };
//**************** Add New Customer *************/
export const addCustomer = async (req, res, next) => {
  try {
        //Add customer
        const newCustomer = new CustomerModel(req.body);
        await newCustomer.save();
    

    
        //Response
        return res.status(201).json({
          message: "Customer has been added Successfully!",
          success: true,
        });
      } catch (err) {
        console.log(err)
        return res.status(500).json({
          message: "Internal Server Error!",
          success: false,
          error: err.message,
        });
      }
  };

