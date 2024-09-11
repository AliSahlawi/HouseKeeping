import express from "express";
import {
  register,
  login,
  getUserInfo,
  markAllNotificationsAsSeen,
  deleteAllSeenNotifications,
  getAllActiveWorkers,
  bookingAppointment,
  bookingAvailability,
  changeBookingStatus,
  changeContractStatus
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

//router obj
const router = express.Router();

//***** Create routes ******/
//Register user
router.post("/register", register);

//Login user
router.post("/login", login);

//Get user info (for protected routes)
router.post("/get-user-info", authMiddleware, getUserInfo);

//Mark all notifications as seen
router.post("/mark-all-notifications-as-seen", markAllNotificationsAsSeen);

//Delete all seen notifications
router.post("/delete-all-seen-notifications", deleteAllSeenNotifications);

//Get all Active workers
router.get("/getAllActiveWorkers", getAllActiveWorkers);

//Book Appointment
router.post("/book-appointment", authMiddleware, bookingAppointment);

//Booking availability
router.post("/booking-availability", authMiddleware, bookingAvailability);

//Change Booking Status
router.post("/changeBookingStatus", authMiddleware, changeBookingStatus);

//Change Booking Status
router.post("/changeContractStatus", authMiddleware, changeContractStatus);

//export
export default router;
