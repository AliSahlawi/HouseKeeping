import React from "react";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import PageNotFound from "./Pages/NotFoundPage";
import { Toaster } from "react-hot-toast";
import Spinner from "./components/Spinner";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import Homepage from "./Pages/Homepage";
import PublicRoute from "./components/routes/PublicRoute";
import ApplyDoctor from "./Pages/ApplyDoctor";
import Notification from "./Pages/Notification";
import Users from "./Pages/admin/Users";
import Doctors from "./Pages/admin/Doctors";
import DoctorProfile from "./Pages/doctor/DoctorProfile";
import BookingPage from "./Pages/BookingPage";
import Appointments from "./Pages/Appointments";
import DoctorAppointments from "./Pages/doctor/DoctorAppointments";
import UserProfile from "./Pages/UserProfile";
import AdminAppointments from "./Pages/admin/AllAppointments";
import Contracts from "./Pages/admin/Contracts";
import AddWorker from "./Pages/admin/AddWorker";
import AddCustomer from "./Pages/admin/AddCustomer";
import OverView from "./Pages/admin/OverView";

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Spinner />
      <Routes>
        {/***** PROTECTED ROUTES *******/}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Homepage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/apply-doctor"
          element={
            <ProtectedRoute>
              <ApplyDoctor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/doctors"
          element={
            <ProtectedRoute>
              <Doctors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/appointments/:contractId?"
          element={
            <ProtectedRoute>
              <AdminAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/contracts"
          element={
            <ProtectedRoute>
              <Contracts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/overview"
          element={
            <ProtectedRoute>
              <OverView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-worker"
          element={
            <ProtectedRoute>
              <AddWorker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-customer"
          element={
            <ProtectedRoute>
              <AddCustomer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notification />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/profile/:id"
          element={
            <ProtectedRoute>
              <DoctorProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/appointments"
          element={
            <ProtectedRoute>
              <DoctorAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/worker/book-appointment/:workerId"
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <Appointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        {/******* PUBLIC ROUTES ******/}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
