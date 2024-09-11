import React from "react";
import { useNavigate } from "react-router-dom";

const WorkerList = ({ worker }) => {
  const navigate = useNavigate();
 
  return (
    <>
    <div className="col-md-3 m-4">
      <div className="card shadow">
        <div className="card-body">
          <h5 className="card-title text-primary mb-4">
           {worker.firstName} {worker.lastName}
          </h5>
          <ul className="list-group list-group-flush mb-4">
            <li className="list-group-item">
              <span className="fw-bold">Timings:</span> {worker.timings[0]} - {worker.timings[1]}
            </li>
            <li className="list-group-item">
              <span className="fw-bold">Fee Per Hour:</span> BHD {worker.feePerHour}
            </li>
          </ul>
          <button
            onClick={() => navigate(`/worker/book-appointment/${worker._id}`)}
            className="btn btn-primary w-100"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>

    </>
  );
};

export default WorkerList;
