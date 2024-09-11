import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { changeContractStatus, getAllContracts } from "../../api/adminApi";
import { Table } from 'antd';
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/spinnerSlice";
import toast from "react-hot-toast";
const Contracts = () => {
  const navigate = useNavigate();
  

    const [contracts, setContracts] = useState([]);
    const dispatch = useDispatch();


// Extract unique customer values
const uniqueCustomers = [...new Set(contracts.map(record => record.customerInfo._id))];

// Create filter options
const customerFilters = uniqueCustomers.map(customerId => {
  const customer = contracts.find(record => record.customerInfo._id === customerId).customerInfo;
  return {
    text: `${customer.firstName} ${customer.lastName}`,
    value: customerId
  };
});

// Extract unique worker IDs
const uniqueWorkers = [...new Set(contracts.map(record => record.workerInfo._id))];

// Create filter options
const workerFilters = uniqueWorkers.map(workerId => {
  const worker = contracts.find(record => record.workerInfo._id === workerId).workerInfo;
  return {
    text: `${worker.firstName} ${worker.lastName}`,
    value: workerId
  };
});

    //Fetch all Appointments req
    const fetchAllContracts = async () => {
      try {
        dispatch(showLoading());
        const res = await getAllContracts();
        dispatch(hideLoading());
  
        if (res.success) {
          setContracts(res.data);
        }
      } catch (err) {
        dispatch(hideLoading());
        console.log(err);
      }
    };
  
    //Change Booking  status
    const handleContractStatus = async (record, status) => {
      try {
        dispatch(showLoading());
        const res = await changeContractStatus(record._id, status);
        if(res.success) {
          const updatedContract = contracts.map( contract => record._id === contract._id ? { ...contract, status } : contract );
          setContracts(updatedContract);
        }
        toast.success(res.message);
        dispatch(hideLoading());
      } catch (err) {
        dispatch(hideLoading());
        toast.error(err.response.data.message);
      }
    };
  
    useEffect(() => {
      fetchAllContracts();
    }, []);
  
    //Antd Table
    const columns = [
      {
        title: 'Customer',
        dataIndex: 'customer',
        render: (text, record) => <a onClick={() => navigate(`/admin/appointments/${record._id}`)}>{record.customerInfo.firstName} {record.customerInfo.lastName}</a>,
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
          <span className={`status-cell ${status === "terminated" ? "canceled" : "approved"}`}>
            {status}
          </span>
        ),
      },
      {
        title: 'End Date',
        dataIndex: 'endDate',
        sorter: (a, b) => new Date(a.date) - new Date(b.date),
        render: (date) => new Date(date).toLocaleDateString(),
      },
      // {
      //   title: "Time",
      //   dataIndex: "time",
      //   render: (time) => `${new Date(time[0]).toLocaleTimeString()} to ${new Date(time[1]).toLocaleTimeString()}`
      // },
      {
        title: "",
        dataIndex: "price",
        render: (text, record) => <span>BHD {record.price}</span>,
      },
      {
        title: "Actions",
        dataIndex: "actions",
        render: (text, record) => (
          <div className="d-flex flex-column">
  {record.status === "active" && (
    <>
      <div className="mb-2">
        <button 
          className="btn btn-danger" 
          onClick={() => handleContractStatus(record, "terminated")}
        >
          Terminate Contract
        </button>
      </div>
    </>
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
            dataSource={contracts.filter(contract => contract.status !== "terminated")}
            columns={columns}
            rowKey={(record) => record._id}
            scroll={{ x: "max-content" }}
          />
        </div>
      </Layout>
    );
  };

export default Contracts