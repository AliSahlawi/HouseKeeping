import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  getAllUser,
  getAllDoctor,
  changeAccountStatus,
  getAllAppointments,
} from "../controllers/adminController.js";

//Router Obj
const router = express.Router();

//Get all user
router.get("/getAllUser", authMiddleware, getAllUser);

//Get all Doctors
router.get("/getAllDoctors", authMiddleware, getAllDoctor);

//Get all Appointements
router.get("/getAllAppointments", authMiddleware, getAllAppointments);

//Account Status Change
router.post("/changeAccountStatus", authMiddleware, changeAccountStatus);


//Export
export default router;
