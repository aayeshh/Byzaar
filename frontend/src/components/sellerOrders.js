import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Navbar from "./Navbar";
import { useStateValue } from "../StateProvider";
import axios from "../axios";

function SellerOrders() {
  const [{ user }] = useStateValue();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.UserID ) return;

      try {
        const response = await axios.post("/api/transactions/pending", {
          Seller_ID: user?.UserID ,
        });

        if (response.data.success) {
          setOrders(response.data.transactions);
        } else {
          alert("Failed to fetch orders.");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        alert(error.response?.data?.message || "Something went wrong.");
      }
    };

    fetchOrders();
  }, [user?.UserID]);

  return (
    <Container>
      <Navbar />
      <Main>
        <h1>Pending Orders</h1>
        <OrderList>
          {orders.length === 0 ? (
            <p>No pending orders found.</p>
          ) : (
            orders.map((order) => (
              <OrderCard key={order.Transaction_ID}>
                <h3>Transaction ID: {order.Transaction_ID}</h3>
                <p><strong>Buyer:</strong> {order.Buyer_ID}</p>
                <p><strong>Product:</strong> {order.Product_ID}</p>
                <p><strong>Quantity:</strong> {order.Quantity}</p>
                <p><strong>Status:</strong> {order.Payment_Status}</p>
                <p><strong>Total:</strong> ${order.Price_bought}</p>
              </OrderCard>
            ))
          )}
        </OrderList>
      </Main>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  background-color: rgb(234, 237, 237);
  min-height: 100vh;
`;

const Main = styled.div`
  max-width: 1200px;
  margin: auto;
  padding: 40px 20px;

  h1 {
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 30px;
  }
`;

const OrderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const OrderCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.1);

  h3 {
    font-size: 20px;
    margin-bottom: 10px;
    color: #111;
  }

  p {
    font-size: 15px;
    color: #555;
  }

  strong {
    color: #111;
  }
`;

export default SellerOrders;