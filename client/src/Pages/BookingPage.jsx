import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  bookingAppointment,
  bookingAvailability,
  getAllCustomers,
  getWorkerById,
} from "../api/api";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/spinnerSlice";
import toast from "react-hot-toast";
import { DatePicker, TimePicker, Flex, Radio, Col, Select, Checkbox } from "antd";
import moment from "moment";

const BookingPage = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);


  const [customers, setCustomers] = useState([]);
  const [worker, setWorker] = useState([]);
  const [dates, setDates] = useState([]);
  const [time, setTime] = useState([]);
  const [numberOfHours, setNumberOfHours] = useState("3");
  const [isAvailable, setIsAvailable] = useState(false);
  const [isContract, setIsContract] = useState(false);
  const [endDate, setEndDate] = useState(null);

  const [selectedCustomer, setSelectedCustomer] = useState(null); // State to hold the selected user

  const handleCustomerChange = (value) => {
    setSelectedCustomer(value); // Update the selected user in the state
  };


 const onDatesChange = (date, dateString) => {
    setDates(dateString);
    setIsAvailable(false);
  };

  const onEndDateChange = (date, dateString) => {
    setEndDate(dateString);
    setIsAvailable(false);
  };

  const onNumberOfHoursChange = ({ target: { value } }) => {
    setNumberOfHours(value);
    setIsAvailable(false);
  }

  const onCheckBoxChanged = ({ target: { checked } }) => {
    setIsContract(checked);
    if(!checked){ setEndDate(null);}
    setIsAvailable(false);
  };

  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const fetchAllUsers = async() => {
    try{
      dispatch(showLoading());
      const response = await getAllCustomers();
      dispatch(hideLoading());
      setCustomers(response.data);
    }
    catch (err) {
      dispatch(hideLoading());
      toast.error(err.response.data.message);
    }
  };
  //Fetching doctor
  const fetchWorkerById = async () => {
    try {
      dispatch(showLoading());
      const response = await getWorkerById({ workerId: params.workerId });
      dispatch(hideLoading());
      setWorker(response.data);
    } catch (err) {
      dispatch(hideLoading());
      toast.error(err.response.data.message);
    }
  };

  // Booking appointments
  const handleBooking = async () => {
  
    if(!selectedCustomer) {
      toast.error("Please Select a Customer");
      return;
    }
    if( dates.length === 0 || time.length === 0 )
      {
        toast.error("Please Select Date and Time");
        return;
      }
      if(isContract && !endDate){
        toast.error("Please Select Contract End Date")
        return;
      }
    const data = {
      workerId: params.workerId,
      customerId: selectedCustomer,
      workerInfo: worker,
      date: dates,
      time: time,
      numberOfHours: numberOfHours,
      endDate: endDate
    };
    try {
      dispatch(showLoading());
      const res = await bookingAppointment(data);
      dispatch(hideLoading());
      toast.success(res.message);
      navigate("/");
    } catch (err) {
      dispatch(hideLoading());
      toast.error(err.response.data.message);
    }
  };

  //
  const handleAvailability = async () => {

        
    if(!selectedCustomer) {
      toast.error("Please Select a Customer");
      return;
    }
    if( dates.length === 0 || time.length === 0 )
      {
        toast.error("Please Select Date and Time");
        return;
      }
      if(isContract && !endDate){
        toast.error("Please Select Contract End Date")
        return;
      }
    const data = { workerId: params.workerId, dates, time, numberOfHours,endDate };
    try {
      dispatch(showLoading());
      const res = await bookingAvailability(data);
      dispatch(hideLoading());
      if (res.success) {
        setIsAvailable(true);
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      dispatch(hideLoading());
      toast.error(err.response.data.message);
    }
  };

  function validation() {

  }

  useEffect(() => {
    fetchWorkerById();
    fetchAllUsers();
  }, []);

  return (
    <Layout>
      <div className="container mt-4">
        <h1 className="text-center mb-5">Booking Page</h1>
        {worker && (
          <div className="card w-100 mt-3">
            <div className="card-body">
              <h3 className="card-title text-center">
                {worker.firstName} {worker.lastName}
              </h3>
              <p className="card-text">
                <b>Fees Per Hour:</b> <i>BHD {worker.feePerHour}</i>
              </p>

              <p className="card-text">
                <b>Timings:</b>{" "}
                <i>
                  {worker.timings?.[0]} - {worker.timings?.[1]}
                </i>
              </p>
               
                <Select
                  showSearch
                  placeholder='Select a Customer'
                  filterOption={filterOption}
                  value={selectedCustomer}
                  onChange={handleCustomerChange}
                  options={customers.map((customer) => ({
                    label: `${customer.firstName} ${customer.lastName} ${customer.phone}`,
                    value: customer._id // Assuming user.id is used as the value
                  }))}
                />
            <br/>
            <br/>

              <div className="d-flex flex-column gap-2">
                <DatePicker
                  aria-required={"true"}
                  multiple
                  className="mb-2"
                  format={"DD-MM-YYYY"}
                  onChange={ onDatesChange }
                />

                <TimePicker
                  aria-required={"true"}
                  className="mb-2"
                  format={"HH:mm"}
                  
                  onChange={(time) => setTime(time? time.format("HH:mm") : time)}
                />
                <Flex vertical gap="middle" style={{ marginBottom: '10px' }}>
                  <Radio.Group onChange={onNumberOfHoursChange} defaultValue="3">
                    <Radio.Button value="1">1 Hour</Radio.Button>
                    <Radio.Button value="2">2 Hours</Radio.Button>
                    <Radio.Button value="3">3 Hours</Radio.Button>
                    <Radio.Button value="4">4 Hours</Radio.Button>
                    <Radio.Button value="5">5 Hours</Radio.Button>
                    <Radio.Button value="6">6 Hours</Radio.Button>
                    <Radio.Button value="9">9 Hours</Radio.Button>
                  </Radio.Group>
                </Flex>

                <Checkbox onChange={onCheckBoxChanged}>Contract</Checkbox>
                {isContract && (
                  <div>
                    <label htmlFor="endDate">Contranct End Date: </label>
                    <DatePicker
                    id="endDate"
                  aria-required={"true"}
                  className="m-2"
                  format={"DD-MM-YYYY"}
                  onChange={ onEndDateChange }
                />
                </div>
                )}
              
                <button
                  className="btn btn-primary"
                  onClick={handleAvailability}
                >
                  Check Availability
                </button>

                {isAvailable && (
                  <button
                    className="btn btn-success mt-2"
                    onClick={handleBooking}
                  >
                    Book Now
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookingPage;
