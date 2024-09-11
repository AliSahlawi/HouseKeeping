import { Button, Col, Form, Input, Row, Select} from "antd";
import React from "react";
import Layout from "../../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { hideLoading, showLoading } from "../../redux/spinnerSlice";
import { addNewCustomer } from "../../api/adminApi";
import { cities } from "../../Utils/Constants";

const AddCustomer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);

  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  //Form Submit
  const onFinish = async (values) => {
    const data = { ...values };
    try {
      dispatch(showLoading());
      await addNewCustomer(data);
      dispatch(hideLoading());
      toast.success("Customer has been Added successfully!");
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
          Add New Customer
        </h1>
        <hr />
        <Form name="customer-form" layout="vertical" onFinish={onFinish}>
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
                label="Phone Number"
                name="phone"
                rules={[
                  { required: true, message: "Please enter your Phone Number!" },
                  {
                    pattern: /^\+?[0-9]{8,13}$/,
                    message: "Please enter a valid phone number (8-13 digits)!",
                  },
                ]}
              >

                <Input  placeholder="Enter Phone Number" />
              </Form.Item>
            </Col>
            
            <Col span={8} xs={24} sm={24} lg={8}>
              <Form.Item
                label="City"
                name="city"
                rules={[
                  { required: true, message: "Please select a city!" },
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
                <Select showSearch placeholder='Select a City' filterOption={filterOption} options={cities} />
              </Form.Item>
            </Col>

            <Col span={8} xs={24} sm={24} lg={8}>
              <Form.Item
                label="House No."
                name="house"
                rules={[
                  { required: true, message: "Please Enter a House Number!" },
                  {
                    min: 2,
                    message: "House Number must be at least 2 characters long!",
                  },
                  {
                    max: 10,
                    message: "House Number cannot exceed 10 characters!",
                  },
                ]}
              >
                <Input  placeholder="Enter House Number" />
              </Form.Item>
            </Col>


            <Col span={8} xs={24} sm={24} lg={8}>
              <Form.Item
                label="Street No."
                name="street"
                rules={[
                  { required: true, message: "Please Enter Street Number!" },
                  {
                    min: 2,
                    message: "Street Number be at least 2 characters long!",
                  },
                  {
                    max: 10,
                    message: "Street Number cannot exceed 15 characters!",
                  },
                ]}
              >
                <Input  placeholder="Enter Street Number" />
              </Form.Item>
            </Col>

            <Col span={8} xs={24} sm={24} lg={8}>
              <Form.Item
                label="Block No"
                name="block"
                rules={[
                  { required: true, message: "Please Enter block Number!" },
                  {
                    min: 2,
                    message: "Block Number be at least 2 characters long!",
                  },
                  {
                    max: 10,
                    message: "block Number cannot exceed 15 characters!",
                  },
                ]}
              >
                <Input  placeholder="Enter Block Number" />
              </Form.Item>
            </Col>


          </Row>
          <hr />



          <div className="d-flex justify-content-end">
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Add Customer
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Layout>
    </>
  );
};

export default AddCustomer;
