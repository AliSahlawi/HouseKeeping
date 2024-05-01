import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getUserAppointments,changeBookingStatus } from "../api/api";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/spinnerSlice";
import toast from "react-hot-toast";
import moment from "moment";
import { Table } from "antd";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();

  // Fetch User Appointments
  const fetchUserAppointments = async () => {
    try {
      dispatch(showLoading());
      const res = await getUserAppointments();
      setAppointments(res.data);
      dispatch(hideLoading());
    } catch (err) {
      dispatch(hideLoading());
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
    fetchUserAppointments();
  }, []);

  //Create antd table
  const columns = [
    {
      title: "Doctor Name",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          {record.doctorInfo.firstName} {record.doctorInfo.lastName}
        </span>
      ),
    },
    {
      title: "Department",
      dataIndex: "department",
      render: (text, record) => <span>{record.doctorInfo.department}</span>,
    },
    {
      title: "Experience",
      dataIndex: "experience",
      render: (text, record) => <span>{record.doctorInfo.experience}</span>,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      render: (text, record) => <span>{record.doctorInfo.phoneNumber}</span>,
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      render: (text, record) => (
        <span>
          {moment(record.date).format("DD-MM-YYYY")} &nbsp;
          {moment(record.time).format("HH:mm")}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {record.status != "canceled" ? 
            <button className="btn btn-danger" 
            onClick={() => handleBookingStatus(record, "canceled")}
            >Cancel Appointment.</button>
            : <span></span>
      }
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="table-responsive">
        <h1 className="m-4 text-center">Appointments List</h1>
        <Table
          className="mt-3"
          columns={columns}
          dataSource={appointments}
          rowKey={(record) => record._id}
          scroll={{ x: "max-content" }}
        />
      </div>
    </Layout>
  );
};

export default Appointments;
