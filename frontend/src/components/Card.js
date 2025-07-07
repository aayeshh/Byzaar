import React from "react";
import styled from "styled-components";
import { useStateValue } from "../StateProvider";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import Rating from "@mui/material/Rating"; // ✅ Import MUI Rating

function Card({ id, image, title, price, category, sellerid }) {
  const [{ user }, dispatch] = useStateValue();
  const navigate = useNavigate();

  const addToBasket = async (e) => {
    e.stopPropagation();
    dispatch({
      type: "ADD_TO_BASKET",
      item: {
        id,
        title,
        price,
        image,
        category,
        sellerid,
      },
    });

    if (user?.UserType === "buyer") {
      try {
        const response = await axios.post(
          "/api/cart",
          {
            Buyer_ID: user?.UserID,
            Product_ID: id,
            Category_ID: category,
          },
          { withCredentials: true }
        );
        console.log("Item added to DB cart:", response.data);
      } catch (error) {
        console.error("Failed to add item to DB cart:", error);
        alert("Could not add to cart. Please try again.");
      }
    }
  };

  const navigateToProduct = () => {
    navigate(`/product/${id}`);
  };

  return (
    <Container onClick={navigateToProduct}>
      <Image>
        <img src={image} alt={title} />
      </Image>
      <Description>
        <h5>{title}</h5>
        <p>$ {price}</p>
        <Rating name="read-only" value={4} precision={0.5} readOnly /> {/* ⭐ Placeholder */}
        <button onClick={addToBasket}>Add to Cart</button>
      </Description>
    </Container>
  );
}
const Container = styled.div`
  width: 250px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
  overflow: hidden;

  &:hover {
    transform: scale(1.03);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
  }
`;

const Image = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 15px;
  padding-bottom: 10px;

  img {
    width: 160px;
    height: 180px;
    object-fit: contain;
    transition: transform 0.2s ease-in-out;

    ${Container}:hover & {
      transform: scale(1.05);
    }
  }
`;

const Description = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;

  h5 {
    font-size: 15px;
    font-weight: 500;
    color: #333333;
    margin-bottom: 8px;
    height: 38px;
    overflow: hidden;
  }

  p {
    font-size: 16px;
    font-weight: bold;
    color: #b12704;
    margin-bottom: 10px;
  }

  button {
    margin-top: auto;
    padding: 8px 12px;
    background-color: #ffd814;
    color: #0f1111;
    font-weight: 600;
    border: 1px solid #fcd200;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;

    &:hover {
      background-color: #f7ca00;
    }
  }
`;

export default Card;