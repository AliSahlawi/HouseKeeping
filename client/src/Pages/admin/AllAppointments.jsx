import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { changeBookingStatus, getAllAppointments } from "../../api/api";
import { Table } from "antd";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/spinnerSlice";
import toast from "react-hot-toast";
const AllAppointments = () => {


    const [appointments, setAppointments] = useState([]);
    const dispatch = useDispatch();
  
    //Fetch all Appointments req
    const fetchAllAppointments = async () => {
      try {
        dispatch(showLoading());
        const res = await getAllAppointments();
        dispatch(hideLoading());
  
        if (res.success) {
          setAppointments(res.data);
        }
      } catch (err) {
        dispatch(hideLoading());
        console.log(err);
      }
    };
  
    //Change Booking  status
    const handleBookingStatus = async (record, status) => {
      try {
        dispatch(showLoading());
        const res = await changeBookingStatus(record._id, status);
        toast.success(res.message);
        dispatch(hideLoading());
      } catch (err) {
        dispatch(hideLoading());
        toast.error(err.response.data.message);
      }
    };
  
    useEffect(() => {
      fetchAllAppointments();
    }, []);
  
    //Antd Table
    const columns = [
      {
        title: "User Name",
        dataIndex: "user",
        render: (text, record) => <span>{record.userInfo.name}</span>,
      },
      {
        title: "Doctor",
        dataIndex: "doctor",
        render: (text, record) => <span>{record.doctorInfo.firstName} {record.doctorInfo.lastName}</span>,
      },
      {
        title: "Status",
        dataIndex: "status",
      },
      {
        title: "Date",
        dataIndex: "date",
        render: (date) => new Date(date).toLocaleDateString(),
      },
      {
        title: "Time",
        dataIndex: "time",
        render: (time) => new Date(time).toLocaleTimeString(),
      },
      {
        title: "Actions",
        dataIndex: "actions",
        render: (text, record) => (
          <div className="d-flex flex-column">
  {record.status === "pending" && (
    <>
      <div className="mb-2">
        <button 
          className="btn btn-danger" 
          onClick={() => handleBookingStatus(record, "canceled")}
        >
          Cancel Appointment
        </button>
      </div>
      <div>
        <button
          className="btn btn-success"
          onClick={() => handleBookingStatus(record, "approved")}
        >
          Approve Appointment
        </button>
      </div>
    </>
  )}

  {record.status === "approved" && (
    <div className="mb-2">
      <button 
        className="btn btn-danger" 
        onClick={() => handleBookingStatus(record, "canceled")}
      >
        Cancel Appointment
      </button>
    </div>
  )}
</div>
        ),
      },
    ];
  
    return (
      <Layout>
        <div className="table-responsive">
          <h1>All Appointments</h1>
          <Table
            dataSource={appointments}
            columns={columns}
            rowKey={(record) => record._id}
            scroll={{ x: "max-content" }}
          />
        </div>
      </Layout>
    );
  };

export default AllAppointments