import { Button, Col, Form, Input, InputNumber, Row, TimePicker, Select} from "antd";
import React from "react";
import Layout from "../../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { hideLoading, showLoading } from "../../redux/spinnerSlice";
import { addNewWorker } from "../../api/adminApi";
import { cities } from "../../Utils/Constants";
import moment from "moment";

const AddWorker = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);

  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  //Form Submit
  const onFinish = async (values) => {
    const data = { ...values };
    data.timings = values.timings.map((time) => time.format("HH:mm"));
    try {
      dispatch(showLoading());
      await addNewWorker(data);
      dispatch(hideLoading());
      toast.success("Worker has been Added successfully!");
      navigate("/");
    } catch (err) {
      dispatch(hideLoading());
      toast.error(err.response.data.message);
    }
  };

  return (
    <>
      <Layout>
        <h1 className="mb-1 montserrat d-flex justify-content-center">
          Add New Worker
        </h1>
        <hr />
        <Form name="worker-form" layout="vertical" onFinish={onFinish}>
          <h3 className="mb-2 text-secondary">Personal Information:</h3>
          <Row gutter={10}>
            <Col span={8} xs={24} sm={24} lg={8}>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[
                  { required: true, message: "Please enter first name!" },
                  {
                    min: 2,
                    message: "First name must be at least 2 characters long!",
                  },
                  {
                    max: 15,
                    message: "First name cannot exceed 15 characters!",
                  },
                ]}
              >
                <Input placeholder="Enter First Name" />
              </Form.Item>
            </Col>

            <Col span={8} xs={24} sm={24} lg={8}>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[
                  { required: true, message: "Please enter your last name!" },
                  {
                    min: 2,
                    message: "Last name must be at least 2 characters long!",
                  },
                  {
                    max: 15,
                    message: "Last name cannot exceed 15 characters!",
                  },
                ]}
              >
                <Input placeholder="Enter Last Name" />
              </Form.Item>
            </Col>
            <Col span={8} xs={24} sm={24} lg={8}>
              <Form.Item
                label="Fee Per Hour (Rate) (BHD)"
                name="feePerHour"
                rules={[
                  {
                    required: true,
                    message: "Please enter fee Per Hour!",
                  },
                  {
                    type: "number",
                    min: 0,
                    max: 100,
                    message: "Fees cannot exceed 100 Bahraini Dinar!",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  prefix="BHD"
                  placeholder="Enter fee per Hour"
                />
              </Form.Item>
            </Col>


          </Row>
          <hr />

          <h3 className="mb-1 text-secondary">Professional Information:</h3>
          <Row gutter={10}>
        

            <Col span={8} xs={24} sm={24} lg={8}>
              <Form.Item
                label="Timings"
                name="timings"
                rules={[
                  {
                    required: true,
                    message: "Please enter the timings!",
                  },
                ]}
              >
                <TimePicker.RangePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <div className="d-flex justify-content-end">
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Add Worker
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Layout>
    </>
  );
};

export default AddWorker;
