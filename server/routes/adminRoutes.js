import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  getAllUser,
  getAllAppointments,
  getAllCustomers,
  getAllContracts,
  addWorker,
  addCustomer,
  getWorkerById,
  getAppointmentByContract,
  getAppointmentInRange,
  getPriceForContract
} from "../controllers/adminController.js";

//Router Obj
const router = express.Router();

//Get all user
router.get("/getAllUser", authMiddleware, getAllUser);

//Get all Appointements
router.get("/getAllAppointments", authMiddleware, getAllAppointments);

//Get all Customers
router.get("/getAllCustomers", authMiddleware, getAllCustomers);

//Get all Contrancts
router.get("/getAllContracts", authMiddleware, getAllContracts);

//Add New Worker
router.post("/add-worker", authMiddleware, addWorker);

//Add New Customer
router.post("/add-customer", authMiddleware, addCustomer);

//Get Worker By Id
router.post("/getWorkerById", getWorkerById);

//Get Appointment By Contract
router.post("/getAppointmentByContract", getAppointmentByContract);

//Get Appointment By Contract
router.post("/getAppointmentInRange", getAppointmentInRange);

router.post("/getPriceForContract", getPriceForContract);


//Export
export default router;
