import moment from "moment";
import BookingModel from "../Models/BookingModel.js";
import ContractModel from "../Models/ContractModel.js";
export const checkOverallAvailability = async (workerId, dates, time, numberOfHours) => {
    const unavailableDates = [];
    const isoTime = moment(time, "HH:mm").toISOString();
    const fromTime = moment(isoTime).toISOString();
    const toTime = moment(isoTime).add(numberOfHours, "hours").toISOString();
  
    for (const date of dates) {
      const isoDate = moment(date, "DD-MM-YYYY").toISOString();
      const isAvailable = await checkAvailabilityForDate(workerId, isoDate, fromTime, toTime);
      if (!isAvailable) {
        unavailableDates.push(date);
      }
    }
  
    return unavailableDates;
  };
  
  const checkAvailabilityForDate = async (workerId, isoDate, fromTime, toTime) => {
    const bookings = await BookingModel.find({
      workerId,
      date: isoDate,
      $or: [
        // Check if the existing appointment overlaps with the provided time range
        {
          $and: [
            { time: { $gte: fromTime } }, // Existing appointment starts after or at the same time as the provided start time
            { time: { $lt: toTime } } // Existing appointment ends before the provided end time
          ]
        },
        {
          $and: [
            { time: { $lte: fromTime } }, // Existing appointment ends before or at the same time as the provided start time
            { endTime: { $gt: fromTime } } // Existing appointment's end time is after the provided start time
          ]
        }
      ]
    });
    return bookings.length === 0;
  };
  

  // Function to create contract
export const createContract = async (customerId, workerId, workerInfo, customerInfo, endDate) => {
  const contract = new ContractModel({
    customerId,
    workerId,
    workerInfo,
    customerInfo,
    endDate
  });
  await contract.save();
  return contract;
};

// Function to create and save bookings
export const createBookings = async (workerId, customerId, workerInfo, customerInfo, dates, startTime, endTime, price, contract) => {
  for (const date of dates) {
    let currentDate = moment(date);
    const endDate = contract ? moment(contract.endDate) : currentDate.clone().add(1, 'week');


    while (currentDate <= endDate) {
      const formattedDate = moment(currentDate).toISOString();
      const newBooking = new BookingModel({
        workerId,
        customerId,
        workerInfo,
        customerInfo,
        date: formattedDate,
        time: [startTime, endTime],
        status: "approved",
        price,
        contractId: contract ? contract._id : undefined
      });
      await newBooking.save();
      currentDate.add(1, 'week');
    }
  }
};