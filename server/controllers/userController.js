import UserModel from "../Models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import WorkerModel from "../Models/WorkerModel.js";
import BookingModel from "../Models/BookingModel.js";
import CustomerModel from "../Models/CustomerModel.js";
import { checkOverallAvailability, createContract, createBookings } from "../services/BookingService.js"
import moment from "moment";
import ContractModel from "../Models/ContractModel.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    //Validation
    if (!name || !email || !password) {
      return res.status(422).json({
        message: "Please provide all fields!",
        success: false,
      });
    }
    //Password validation
    if (password.length < 6) {
      return res.status(422).json({
        message: "Password length should be greater than 6 character",
        success: false,
      });
    }

    //Check existing user
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User Already Exists!",
        success: false,
      });
    }

    //Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    //Register user
    const user = new UserModel(req.body);
    await user.save();
    return res.status(201).json({
      user,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error!",
      success: false,
      error: err.message,
    });
  }
};

//*************** USER LOGIN **********/
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //Validation
    if (!email || !password) {
      return res.status(422).json({
        message: "Please provide all fields!",
        success: false,
      });
    }

    //Password Validation
    if (password.length < 6) {
      return res.status(422).json({
        message: "Password length should be greater than 6 character",
        success: false,
      });
    }

    //Check user is exist or not
    const getUser = await UserModel.findOne({ email: email.toLowerCase() });
    if (!getUser) {
      return res.status(404).json({
        message: "Invalid Credentials!",
        success: false,
      });
    }

    //Password match
    const comparePassword = await bcrypt.compare(password, getUser.password);
    if (!comparePassword) {
      return res.status(400).json({
        message: "Incorrect Password, Please check again...",
        success: false,
      });
    }

    //Generate token
    const token = jwt.sign({ id: getUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    //Login success
    return res.status(200).json({
      success: true,
      token,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error!",
      success: false,
      error: err.message,
    });
  }
};

//********* GET USER INFO (FOR PROTECTED ROUTES) ******/
export const getUserInfo = async (req, res, next) => {
  try {
    //Get user
    const user = await UserModel.findOne({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(404).json({
        message: "User doesn't exists!",
        success: false,
      });
    }

    //Success response
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error!",
      success: false,
      error: err.message,
    });
  }
};


//************ MARK ALL NOTIFICATIONS AS SEEN *******************/
export const markAllNotificationsAsSeen = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ _id: req.body.userId });
    const unSeenNotifications = user.unSeenNotifications;

    //Append unSeenNotifications to seenNotifications array
    user.seenNotifications.push(...unSeenNotifications);

    //Clear unSeenNotifications array
    user.unSeenNotifications = [];

    //Save the Updated user
    const updatedUser = await user.save();
    updatedUser.password = undefined; //Password hide
    return res.status(200).json({
      success: true,
      message: "All notifications marked as seen!",
      data: updatedUser,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error!",
      success: false,
      error: err.message,
    });
  }
};

//************ DELETE ALL SEEN NOTIFICATIONS *******************/
export const deleteAllSeenNotifications = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ _id: req.body.userId });

    //Clear the seenNotifications array
    user.seenNotifications = [];

    //Save the updated user
    const updatedUser = await user.save();
    updatedUser.password = undefined;

    return res.status(200).json({
      success: true,
      message: "All seen notifications deleted!",
      data: updatedUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
      error: err.message,
    });
  }
};

//************** GET ALL Active WORKERS ***********/
export const getAllActiveWorkers = async (req, res) => {
  try {
    const workers = await WorkerModel.find({ isActive: true });
    if (!workers) {
      return res.status(404).json({
        success: false,
        message: "Worker not found.",
      });
    }

    //success res
    return res.status(200).json({
      success: true,
      message: "Workers list fetched successfully!",
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

//************** BOOK APPOINTMENTS ***********/
export const bookingAppointment = async (req, res) => {
  try {
    // Extract data from request body
    const { workerId, customerId, workerInfo, date, time, status, numberOfHours, endDate } = req.body;

    // Validate required fields
    if (!date || !time) {
      return res.status(422).json({
        success: false,
        message: "Please select date and time!",
      });
    }

    // Convert time to ISO format
    const startTime = moment(time, "HH:mm").toISOString();
    const endTime = moment(time, "HH:mm").add(numberOfHours, 'hours').toISOString();

    // Convert dates to ISO format
    const convertedDates = date.map(dateStr => moment(dateStr, "DD-MM-YYYY").toISOString());

    // Calculate price
    const price = workerInfo.feePerHour * numberOfHours;

    // Find customer info
    const customerInfo = await CustomerModel.findOne({ _id: customerId });

    // Create contract if end date is provided
    let contract;

    if (endDate) {
      const endDateString = moment(endDate, "DD-MM-YYYY").toISOString();
      contract = await createContract(customerId, workerId, workerInfo, customerInfo, endDateString);
    }

    // Create and save bookings
    await createBookings(workerId, customerId, workerInfo, customerInfo, convertedDates, startTime, endTime, price, contract);

    return res.status(200).json({
      success: true,
      message: "Appointment booking successfully!",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
      error: err.message,
    });
  }
};




//************** BOOK AVAILABILITY ***********/
export const bookingAvailability = async (req, res) => {
  try {
    const { workerId, dates, time, numberOfHours, endDate } = req.body;

    let listOfDates = dates;

    // Handle contract days if endDate is provided
    if (endDate) {
      listOfDates = dates.flatMap(date => {
        const startDate = moment(date, "DD-MM-YYYY");
        const endContractDate = moment(endDate, "DD-MM-YYYY");
        const datesInRange = [];

        while (startDate <= endContractDate) {
          datesInRange.push(startDate.format("DD-MM-YYYY"));
          startDate.add(1, "week");
        }

        return datesInRange;
      });
    }

    // Check availability for the dates
    const unavailableDates = await checkOverallAvailability(workerId, listOfDates, time, numberOfHours, endDate);

    if (unavailableDates.length === 0) {
      return res.status(200).json({
        success: true,
        message: "All dates are available, you can book now!",
      });
    } else {
      return res.status(200).json({
        success: false,
        message: `Appointments not available for the following dates: ${unavailableDates.join(", ")}`,
        unavailableDates: unavailableDates,
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
      error: err.message,
    });
  }
};



//********* CHANGE Bookings STATUS  ********/
export const changeBookingStatus = async (req, res) => {
  try {
    const { bookingId, status } = req.body;

    const booking = await BookingModel.findByIdAndUpdate(bookingId, { status });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    //Success res
    return res.status(201).json({
      success: true,
      message: "Booking status updated!",
      data: booking,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
      error: err.message,
    });
  }
};


//********* CHANGE Bookings STATUS  ********/
export const changeContractStatus = async (req, res) => {
  try {
    const { contractId, status } = req.body;

    const contract = await ContractModel.findByIdAndUpdate(contractId, { status });
    if (!contract) {
      return res.status(404).json({
        success: false,
        message: "Contract not found.",
      });
    }

    //Success res
    return res.status(201).json({
      success: true,
      message: "Contract status updated!",
      data: contract,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
      error: err.message,
    });
  }
};
