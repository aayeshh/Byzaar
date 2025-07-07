import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Navbar from "./Navbar";
import Card from "./Card";
import axios from "../axios";
function CategoryPage() {
  const { Category_Id } = useParams();
  const [products, setProducts] = useState([]);
  console.log("Fetching category:",Category_Id);
  useEffect(() => {
    const fetchProductByCategory = async () => {
      try {
        const response = await axios.post(`/api/products/category`, {Category_Id,});
        console.log(response.data);
        setProducts(response.data.product); // now an array
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
  
    if (Category_Id) {
      fetchProductByCategory();
    }
  }, [Category_Id]);
  
  return (
    <Container>
      <Navbar />
      
      <Banner>
        <img src="/banner.png" alt="desktop banner" />
        <img src="/banner.jpeg" alt="mobile banner" />
      </Banner>

      <Main>
        {products?.map((product) => (
          <Card
            key={product.Product_ID}
            id={product.Product_ID}
            image={product.imageurl}
            price={product.Cost}
            title={product.Product_Name}
            category={product.Category_ID}
            sellerid={product.Seller_ID}
          />
        ))}
      </Main>

      

      <Footer>
        <div>
          <h4>ArrayMazon</h4>
          <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
        </div>
        <Links>
          <a href="/about">About Us</a>
          <a href="/contact">Contact</a>
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
        </Links>
      </Footer>
    </Container>
  );
}

export default CategoryPage;


const Container = styled.div`
  width: 100%;
  background-color: rgb(234, 237, 237);
  max-width: 1400px;
  margin: auto;
  height: fit-content;
`;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex; justify-content: center; align-items: center;
  z-index: 1000;
`;

const PopupBox = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);

  h3 { margin-bottom: 10px; font-size: 22px; }
  p { font-size: 16px; color: #555; }
`;

const CloseButton = styled.button`
  position: absolute;
  right: 20px;
  top: 20px;
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
  color: #999;

  &:hover { color: black; }
`;

const Banner = styled.div`
  width: 100%;
  img {
    width: 100%;
    -webkit-mask-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 2),
      rgba(0, 0, 0, 0.95),
      rgba(0, 0, 0, 0.85),
      rgba(0, 0, 0, 0.75),
      rgba(0, 0, 0, 0.55),
      rgba(0, 0, 0, 0)
    );

    &:nth-child(2) { display: none; }

    @media only screen and (max-width: 767px) {
      &:nth-child(1) { display: none; }
      &:nth-child(2) {
        display: block;
        -webkit-mask-image: none;
      }
    }
  }
`;

const Main = styled.div`
  display: grid;
  justify-content: center;
  place-items: center;
  width: 100%;
  grid-auto-rows: 420px;
  grid-template-columns: repeat(4, 280px);
  grid-gap: 20px;

  @media only screen and (max-width: 767px) {
    grid-template-columns: repeat(2, 50%);
    grid-gap: 0;
  }

  @media only screen and (min-width: 767px) and (max-width: 1200px) {
    grid-template-columns: repeat(3, 30%);
  }

  @media only screen and (min-width: 767px) {
    margin-top: -130px;
    padding: 10px 0px;
  }
`;

const HorizontalSection = styled.div`
  margin: 30px 20px;
  padding: 10px 0;

  h3 {
    margin-bottom: 15px;
    font-size: 20px;
    font-weight: bold;
    color: #111;
  }
`;

const HorizontalScroll = styled.div`
  overflow: hidden;
  position: relative;
  width: 100%;
  animation: scrollX 20s linear infinite;

  &:hover {
    animation-play-state: paused;
  }

  @keyframes scrollX {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
`;

const ScrollContent = styled.div`
  display: flex;
  gap: 15px;
`;

const Footer = styled.footer`
  margin-top: 40px;
  padding: 20px;
  background-color: #131921;
  color: white;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  div {
    h4 { margin: 0; font-size: 18px; }
    p { font-size: 14px; margin-top: 5px; }
  }
`;

const Links = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;

  a {
    color: #ccc;
    font-size: 14px;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
      color: white;
    }
  }

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
    margin-top: 10px;
  }
`;
