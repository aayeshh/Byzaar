import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import Navbar from "./Navbar";
import { useStateValue } from "../StateProvider";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
function Orders() {
  const [{ user, basket, address }, dispatch] = useStateValue();
  const [showPopup, setShowPopup] = useState(true);
  const hasInserted = useRef(false);
  const navigate = useNavigate();
  useEffect(() => {
    const insertOrdersIntoDB = async () => {
      try {
        const requests = basket.map((item) =>
          axios.post("/api/order", {
            Product_ID: item.id || item._id,
            Category_ID: item.category,
            Seller_ID: item.sellerid,
            Buyer_ID: user?.UserID,
            Price_bought: item.price,
            Quantity: 1,
            Payment_Status: "Pending",
          })
        );
  
        await Promise.all(requests);
        console.log("All orders inserted successfully");
        hasInserted.current = true;
      } catch (error) {
        console.error("Error inserting orders:", error);
      }
    };
  
    insertOrdersIntoDB();
  
  }, [basket, user]);
  
  return (
    <Container>
      <Navbar />
      {showPopup && (
        <PopupCard>
          <div>
            <h2>🎉 Thank you {user?.Username} for your order!</h2>
            <p>Your order was placed successfully.</p>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </PopupCard>
      )}
      <Main>
        <OrderContainer>
          <h2>Your Order</h2>
  
          <OrderDetail>
            <AddressComponent>
              <h4>Shipping Address</h4>
              <div>
                <p>{address.fullName}</p>
                <p>{address.flat}</p>
                <p>{address.area}</p>
                <p>{address.landmark}</p>
                <p>
                  {address.city} {address.state}
                </p>
                <p>Phone : {address.phone}</p>
              </div>
            </AddressComponent>
  
            <OrderBasket>
              <h4>Order</h4>
              <p>
                Subtotal : ₹{" "}
                <span>
                  {basket.reduce((total, item) => total + item.price, 0).toFixed(2)}
                </span>
              </p>
              {basket.map((product) => (
                <Product key={product.id || product._id}>
                  <Image>
                    <img src={product.image} alt="" />
                  </Image>
                  <Description>
                    <h4>{product.title}</h4>
                    <p>₹ {product.price}</p>
                  </Description>
                </Product>
              ))}
            </OrderBasket>
          </OrderDetail>
          <BackHomeButton onClick={() => {dispatch({ type: "EMPTY_BASKET" });navigate("/");}}>
            ← Back to Home
          </BackHomeButton>
        </OrderContainer>
      </Main>
    </Container>
  );  
}

const Container = styled.div`
  width: 100%;
  height: fit-content;
  max-width: 1400px;
  margin: auto;
  background-color: rgb(234, 237, 237);
`;

const Main = styled.div`
  min-width: 100vw;
  min-height: 100vh;
  display: flex;
  justify-content: flex-start; /* 👈 push to left */
  padding-left: 160px; /* 👈 give it some breathing space */
`;

const OrderContainer = styled.div`
  padding: 20px 40px;
  background-color: #fff;
  width: 90%;
  max-width: 1000px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);

  h2 {
    font-weight: 500;
    border-bottom: 1px solid lightgray;
    padding-bottom: 15px;
  }
`;


const OrderDetail = styled.div`
  padding: 20px 40px;
  background-color: #fff;
  width: 90%;
  max-width: 700px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);

  h2 {
    font-weight: 500;
    border-bottom: 1px solid lightgray;
    padding-bottom: 15px;
  }
`;

const AddressComponent = styled.div`
  margin-top: 20px;

  div {
    margin-top: 10px;
    margin-left: 10px;

    p {
      font-size: 14px;
      margin-top: 4px;
    }
  }
`;

const OrderBasket = styled.div`
  margin-top: 20px;

  p {
    font-size: 15px;
    margin-left: 15px;
    margin-top: 15px;

    span {
      font-weight: 600;
    }
  }
`;

const Product = styled.div`
  display: flex;
  align-items: center;
`;

const Image = styled.div`
  flex: 0.3;

  img {
    width: 100%;
  }
`;

const Description = styled.div`
  flex: 0.7;

  h4 {
    font-weight: 600;
    font-size: 18px;

    @media only screen and (max-width: 1200px) {
      font-size: 14px;
    }
  }

  p {
    font-weight: 600;
    margin-top: 10px;
  }

  button {
    background-color: transparent;
    color: #1384b4;
    border: none;
    outline: none;
    margin-top: 10px;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const BackHomeButton = styled.button`
  margin-top: 30px;
  padding: 10px 20px;
  background-color: #f0c14b;
  border: 1px solid #a88734;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  color: #111;

  &:hover {
    background-color: #ddb347;
  }
`;

const PopupCard = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  div {
    background: #fff;
    padding: 30px;
    border-radius: 12px;
    text-align: center;
    max-width: 400px;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);

    h2 {
      margin-bottom: 10px;
    }

    button {
      margin-top: 15px;
      padding: 10px 20px;
      background-color: #1384b4;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;

      &:hover {
        background-color: #0f6e98;
      }
    }
  }
`;

export default Orders;