import React, { useEffect, useState } from "react";
import { getAllActiveWorkers } from "../api/adminApi";
import Layout from "../components/Layout";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/spinnerSlice";
import { Row } from "antd";
import DoctorList from "../components/WorkerList";

const Homepage = () => {
  const [workers, setWorkers] = useState([]);
  const dispatch = useDispatch();

  //Get all approved doctors
  const fetchAllActiveWorkers = async () => {
    try {
      dispatch(showLoading());
      const response = await getAllActiveWorkers();
      setWorkers(response.data);
      dispatch(hideLoading());
    } catch (err) {
      dispatch(hideLoading());
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAllActiveWorkers();
  }, []);
  return (
    <>
      <Layout>
        <h1 className="text-center mb-3">Workers List</h1>
        <Row>
          {workers && workers.map((worker) => <DoctorList key={worker._id} worker={worker} />)}
        </Row>
      </Layout>
    </>
  );
};

export default Homepage;
