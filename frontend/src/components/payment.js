import React from "react";
import styled from "styled-components";
import Navbar from "./Navbar";
import { useStateValue } from "../StateProvider";
import { NumericFormat } from "react-number-format";
import { useNavigate } from "react-router-dom";
import { getBasketTotal } from "../reducer";
import axios from "../axios"
function Payment() {

    const [{user, address, basket}, dispatch] = useStateValue();
    const navigate = useNavigate();
    const removefromdb = async (e) => {
      e.preventDefault();
    
      if (user?.UserType === "buyer") {
        try {
          const response = await axios.delete("/api/cart_buyer", {
            data: {
              buyerID: user?.UserID,
            },
            withCredentials: true,
          });
          navigate("/order")
          console.log("Item removed from DB cart:", response.data);
        } catch (error) {
          console.error("Failed to remove item from DB cart:", error);
    
          if (error.response) {
            // Server responded with a status other than 2xx
            console.error("Server Response:", error.response.data);
            alert(`Error: ${error.response.data.message || "Something went wrong"}`);
          } else if (error.request) {
            // No response from server
            console.error("No response received from server.");
            alert("Server did not respond. Please try again later.");
          } else {
            // Something else triggered the error
            console.error("Error", error.message);
            alert("Unexpected error occurred.");
          }
        }
      } else {
        alert("You must be logged in as a buyer to remove items.");
      }
    };
    return (
        <Container>
            <Navbar/>
            <Main>
                <ReviewContainer>
                    <h2>Review Your Order</h2>
                    <AddressContainer>
                        <h5>Shipping Address</h5>

                        <div>
                            <p>{address.fullName}</p>
                            <p>{address.flat}</p>
                            <p>{address.area}</p>
                            <p>{address.landmark}</p>
                            <p>
                                {address.city} {address.state}
                            </p>
                            <p>Phone: {address.phone}</p>
                        </div>
                    </AddressContainer>
                    <PaymentContainer>
                        <h5>Payment Method</h5>

                        <div>
                            <p>
                                Cash on delivery
                            </p>
                        </div>
                    </PaymentContainer>
                    <OrderContainer>
                        <h5>Your Order</h5>
                        <div>
                            {basket?.map((product) => (
                            <Product>
                                <Image>
                                    <img src={product.image} alt=""/>
                                </Image>
                                <Description>
                                    <h4>
                                    {product.title}
                                    </h4>
                                    <p>$ {product.price}</p>
                                </Description>
                            </Product>))}
                        </div>
                    </OrderContainer>
                </ReviewContainer>
                <Subtotal>
                    <NumericFormat
                        renderText={(value) => (
                        <>
                            <p>
                            Subtotal ( {basket.length} items ) : <strong> {value}</strong>
                            </p>
                            <small>
                            <input type="checkbox" />
                            <span>This order contains a gift.</span>
                            </small>
                        </>
                        )}
                        decimalScale={2}
                        value={getBasketTotal(basket)}
                        displayType="text"
                        thousandSeparator={true}
                        prefix={"₹ "}
                    />

                    <button onClick={(e) => {removefromdb(e)}}>
                        Place Order
                    </button>
                </Subtotal>
            </Main>
        </Container>

    )
}

const Container = styled.div`
  width: 100%;

  max-width: 1400px;
  background-color: rgb(234, 237, 237);
`;

const Main = styled.div`
  padding: 15px;
  display: flex;

  @media only screen and (max-width: 1200px) {
    flex-direction: column;
  }
`;

const ReviewContainer = styled.div`
  background-color: #fff;
  flex: 0.7;
  padding: 15px;
  h2 {
    font-weight: 500;
    border-bottom: 1px solid lightgray;
    padding-bottom: 15px;
  }
`;

const AddressContainer = styled.div`
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

const PaymentContainer = styled.div`
  margin-top: 15px;

  div {
    margin-top: 15px;
    margin-left: 15px;

    p {
      font-size: 14px;
    }
  }
`;

const OrderContainer = styled.div`
  margin-top: 30px;
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
const Subtotal = styled.div`
  flex: 0.3;
  background-color: #fff;
  margin-left: 15px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 1200px) {
    flex: none;
    margin-top: 20px;
  }
  p {
    font-size: 20px;
  }

  small {
    display: flex;
    align-items: center;
    margin-top: 10px;

    span {
      margin-left: 10px;
    }
  }

  button {
    width: 65%;
    height: 33px;
    margin-top: 20px;
    background-color: #ffd814;
    border: none;
    outline: none;

    border-radius: 8px;
  }
`;
export default Payment;