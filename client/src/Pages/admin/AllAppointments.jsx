import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import { changeBookingStatus, getAllAppointments, getAppointmentsByContract } from "../../api/adminApi";
import { Table } from 'antd';
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/spinnerSlice";
import toast from "react-hot-toast";
const AllAppointments = () => {

  const params = useParams();

    const [appointments, setAppointments] = useState([]);
    const dispatch = useDispatch();


// Extract unique customer values
const uniqueCustomers = [...new Set(appointments.map(record => record.customerInfo._id))];

// Create filter options
const customerFilters = uniqueCustomers.map(customerId => {
  const customer = appointments.find(record => record.customerInfo._id === customerId).customerInfo;
  return {
    text: `${customer.firstName} ${customer.lastName}`,
    value: customerId
  };
});

// Extract unique worker IDs
const uniqueWorkers = [...new Set(appointments.map(record => record.workerInfo._id))];

// Create filter options
const workerFilters = uniqueWorkers.map(workerId => {
  const worker = appointments.find(record => record.workerInfo._id === workerId).workerInfo;
  return {
    text: `${worker.firstName} ${worker.lastName}`,
    value: workerId
  };
});

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
        //Fetch all Appointments req
        const fetchAppointmentsByContract = async () => {
          try {
            const contractId = params.contractId;
            console.log(params.contractId);
            dispatch(showLoading());
            const res = await getAppointmentsByContract({ contractId: contractId});
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
        if(res.success) {
          const updatedAppointments = appointments.map( appointment => record._id === appointment._id ? { ...appointment, status } : appointment );
          setAppointments(updatedAppointments);
        }
        toast.success(res.message);
        dispatch(hideLoading());
      } catch (err) {
        dispatch(hideLoading());
        toast.error(err.response.data.message);
      }
    };
  
    useEffect(() => {
      if(params.contractId != null){
        fetchAppointmentsByContract();
      }
      else {
      fetchAllAppointments();
      }
    }, []);
  
    //Antd Table
    const columns = [
      {
        title: 'Customer',
        dataIndex: 'customer',
        render: (text, record) => <span>{record.customerInfo.firstName} {record.customerInfo.lastName}</span>,
        filters: customerFilters,
        onFilter: (value, record) => record.customerInfo._id === value,
      },
      {
        title: "Customer Phome Number",
        dataIndex: "phone",
        render: (text, record) => <span>{record.customerInfo.phone} </span>,
      },
      {
        title: "Customer Address",
        dataIndex: "address",
        render: (text, record) => <span>{record.customerInfo.city}<br/>
        House:{record.customerInfo.house}<br/> Street: {record.customerInfo.street}<br/> Block:{record.customerInfo.block} </span>,
      },
      {
        title: 'Worker',
        dataIndex: 'worker',
        render: (text, record) => <span>{record.workerInfo.firstName} {record.workerInfo.lastName}</span>,
        filters: workerFilters,
        onFilter: (value, record) => record.workerInfo._id === value,
      },
      {
        title: "Status",
        dataIndex: "status",
        render: (status) => (
          <span className={`status-cell ${status === "canceled" ? "canceled" : "approved"}`}>
            {status}
          </span>
        ),
      },
      {
        title: 'Date',
        dataIndex: 'date',
        sorter: (a, b) => new Date(a.date) - new Date(b.date),
        render: (date) => new Date(date).toLocaleDateString(),
      },
      {
        title: "Time",
        dataIndex: "time",
        render: (time) => `${new Date(time[0]).toLocaleTimeString()} to ${new Date(time[1]).toLocaleTimeString()}`
      },
      {
        title: "Price",
        dataIndex: "price",
        render: (text, record) => <span>BHD {record.price}</span>,
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