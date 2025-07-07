import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Navbar from "./Navbar";
import axios from "../axios";

function OrderTrackRecord() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setOrders([
      {
        productName: "Wireless Mouse",
        date: "2025-04-15",
        price: 2500,
        status: "Out for Delivery"
      },
      {
        productName: "Laptop Stand",
        date: "2025-04-10",
        price: 1500,
        status: "Delivered"
      }
    ]);
  }, []);
  

  return (
    <Container>
      <Navbar />
      <Main>
        <h1>Your Order Track Record</h1>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order, index) => (
            <OrderCard key={index}>
              <OrderInfo>
                <p><strong>Product:</strong> {order.productName}</p>
                <p><strong>Order Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
                <p><strong>Price:</strong> Rs. {order.price}</p>
                <p><strong>Status:</strong> {order.status}</p>
              </OrderInfo>
              <ProgressBar>
                <Progress status={order.status} />
                <Steps>
                  <Step>Ordered</Step>
                  <Step>Shipped</Step>
                  <Step>Out for Delivery</Step>
                  <Step>Delivered</Step>
                </Steps>
              </ProgressBar>
            </OrderCard>
          ))
        )}
      </Main>
    </Container>
  );
}


const Container = styled.div`
  width: 100%;
  background-color: #f3f3f3;
  min-height: 100vh;
`;

const Main = styled.div`
  max-width: 1000px;
  margin: auto;
  padding: 40px 20px;

  h1 {
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 30px;
  }
`;

const OrderCard = styled.div`
  background-color: #fff;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 50px;
  box-shadow: 0 1px 5px rgba(0,0,0,0.1);
`;

const OrderInfo = styled.div`
  margin-bottom: 15px;

  p {
    font-size: 16px;
    color: #333;
    margin: 4px 0;

    strong {
      color: #111;
    }
  }
`;

const ProgressBar = styled.div`
  position: relative;
  background: #e0e0e0;
  height: 10px;
  border-radius: 5px;
  margin-top: 10px;
`;

const Progress = styled.div`
  background-color: #ffd814;
  height: 100%;
  border-radius: 5px;
  width: ${({ status }) => {
    switch (status) {
      case "Shipped": return "33%";
      case "Out for Delivery": return "66%";
      case "Delivered": return "100%";
      default: return "10%";
    }
  }};
  transition: width 0.4s ease;
`;

const Steps = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
`;

const Step = styled.span`
  font-size: 13px;
  color: #555;
`;

export default OrderTrackRecord;