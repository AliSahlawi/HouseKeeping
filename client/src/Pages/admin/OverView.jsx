import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { getAppointmentsForRange } from "../../api/adminApi";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/spinnerSlice";
import { Calendar } from "antd";
import toast from "react-hot-toast";
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid'; // Import the dayGrid plu
import moment from "moment";


const OverView = () => {
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();

  const fetchAppointmentsForWeek = async (startDate, endDate) => {
    try {
      dispatch(showLoading());
      const res = await getAppointmentsForRange(startDate, endDate);
      

      if (res.success) {
        console.log('Appointments data:', res.data);
        setAppointments(res.data);
        dispatch(hideLoading());
      } else {
        console.error('Failed to fetch appointments:', res.message);
        dispatch(hideLoading());
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
      dispatch(hideLoading());
    }
  };
  useEffect(() => {


    // Fetch appointments for the initial week
    const startOfWeek = moment().startOf('week').toISOString();
    const endOfWeek = moment().endOf('week').toISOString();
    fetchAppointmentsForWeek(startOfWeek, endOfWeek);
  }, []); // Only run once on component mount

  const handleDatesSet = (info) => {
    console.log('Dates Set:', info.startStr, 'to', info.endStr);
    const startDate = moment(info.startStr).toISOString();
    const endDate = moment(info.endStr).toISOString();
    fetchAppointmentsForWeek(startDate, endDate);
  };

  const generateRandomColor = () => {
    const colors = ['#F08D7E', '#EFA18A', '#E2BAB1', '#DDA6B9', '#ACAEC5'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

const renderEventContent = (eventInfo) => {
  const eventStyle = {
    backgroundColor: eventInfo.event.backgroundColor,
    borderColor: eventInfo.event.borderColor,
    fontSize: '12px', // Default font size
    padding: '8px', // Padding around the content
    borderRadius: '5px', // Rounded corners
    color: '#fff', // Text color
    width: '100%', // Take the whole cell width
    height: '100%', // Take the whole cell height
    display: 'flex', // Use flexbox for layout
    flexDirection: 'column', // Content stacked vertically
    justifyContent: 'space-around', // Evenly space content
    alignItems: 'center', // Center content horizontally
    textAlign: 'center', // Center text
  };

  return (
    <div className="event" style={eventStyle}>
      <div style={{ fontWeight: 'bold' }}>{eventInfo.event.title}</div>
      <div>{eventInfo.event.extendedProps.address}</div>
      <div>{eventInfo.event.extendedProps.phone}</div>
      <div>{eventInfo.event.extendedProps.worker}</div>
    </div>
  );
};


  // Function to generate events for the week based on fetched appointments
  const getEventsForWeek = (info, successCallback, failureCallback) => {
    const startOfWeek = moment(info.startStr).startOf('week');
    const endOfWeek = moment(info.endStr).endOf('week');

    const eventsForWeek = appointments.map(appointment => {
      const eventStart = moment(appointment.date[0]);
      const eventEnd = moment(appointment.date[1]);
      const isAllDay = eventStart.isSame(eventEnd, 'day');
      const randomColor = generateRandomColor();
      console.log(moment(appointment.time[0]).format('HH:mm'));

      return {
        title: `${moment(appointment.time[0]).format('HH:mm')} - ${moment(appointment.time[1]).format('HH:mm')} ${appointment.customerInfo.firstName} ${appointment.customerInfo.lastName}`,
        start: eventStart.toISOString(),
        end: eventEnd.toISOString(),
        backgroundColor: randomColor,
        borderColor: randomColor,
        extendedProps: {
          address: `Address: ${appointment.customerInfo.city}, ${appointment.customerInfo.house}, ${appointment.customerInfo.street}, ${appointment.customerInfo.block}`,
          phone: ` Phone: ${appointment.customerInfo.phone}`,
          worker:`Worker: ${appointment.workerInfo.firstName} ${appointment.workerInfo.lastName} `
        }
      };
    }).filter(event => moment(event.start).isBetween(startOfWeek, endOfWeek, null, '[]'));

    successCallback(eventsForWeek);
  };

  return (
    <Layout>
    <div className="table-responsive">
      <h1>Overview</h1>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridWeek"
        events={(info, successCallback, failureCallback) => getEventsForWeek(info, successCallback, failureCallback)}
        eventContent={renderEventContent}
        datesSet={handleDatesSet}
      />
    </div>
    </Layout>
  );
};

export default OverView;
