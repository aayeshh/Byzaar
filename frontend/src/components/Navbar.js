import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useStateValue } from "../StateProvider";

function Navbar() {
  const [{ basket, user }, dispatch] = useStateValue();
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navigate = useNavigate();

  // Handle scroll hide/show
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShowNavbar(false); // Scroll down
      } else {
        setShowNavbar(true); // Scroll up
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const signOut = () => {
    dispatch({
      type: "SET_USER",
      user: null,
    });
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    navigate("/");
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowDropdown(false);
  };

  return (
    <Container visible={showNavbar}>
      <Inner>
        <Logo onClick={() => navigate("/")}>
          <img src="/Byzaar.jpg" alt="Logo" />
        </Logo>

        <SearchBar>
          <input type="text" placeholder="Search..." />
          <SearchIcon onClick={() => setShowDropdown(!showDropdown)}>
            <img src="/filter.png" alt="Filter" />
          </SearchIcon>

          {showDropdown && (
            <Dropdown>
        <CategoryButton onClick={() => navigate("/categories/1")}>Fashion and Accessories</CategoryButton>
        <CategoryButton onClick={() => navigate("/categories/2")}>Electronics</CategoryButton>
        <CategoryButton onClick={() => navigate("/categories/3")}>Stationary</CategoryButton>
        <CategoryButton onClick={() => navigate("/categories/4")}>Groceries</CategoryButton>
        <CategoryButton onClick={() => navigate("/categories/5")}>Music</CategoryButton>
        <CategoryButton onClick={() => navigate("/categories/6")}>Sports</CategoryButton>
        <CategoryButton onClick={() => navigate("/categories/7")}>Video Games</CategoryButton>
            </Dropdown>
          )}
        </SearchBar>

        <RightContainer>
          

          <NavButton
            onClick={() => {
              if (user) {
                if (user.UserType === "seller") navigate("/seller");
                else navigate("/buyer");
              }
            }}
          >
            <p>Hello,</p>
            <p>{user ? user?.Username : "Guest"}</p>
          </NavButton>

          <NavButton onClick={() => {
            if (user) {
              dispatch({ type: "EMPTY_BASKET" });
              signOut();
            } else {
              navigate("/login");
            }
          }}>
            {/* Button content */}
            <p>{user ? "Logout" : "Login"}</p>
          </NavButton>

          <BasketButton onClick={() => navigate("/checkout")}>
            <img src="/basket-icon.png" alt="Basket" />
            <p>{basket?.length || 0}</p>
          </BasketButton>
        </RightContainer>
      </Inner>

      <CategoryBar>
        <CategoryButton onClick={() => navigate("/categories/1")}>Fashion and Accessories</CategoryButton>
        <CategoryButton onClick={() => navigate("/categories/2")}>Electronics</CategoryButton>
        <CategoryButton onClick={() => navigate("/categories/3")}>Stationary</CategoryButton>
        <CategoryButton onClick={() => navigate("/categories/4")}>Groceries</CategoryButton>
        <CategoryButton onClick={() => navigate("/categories/5")}>Music</CategoryButton>
        
        <CategoryButton onClick={() => navigate("/categories/6")}>Sports</CategoryButton>
        <CategoryButton onClick={() => navigate("/categories/7")}>Video Games</CategoryButton>
      </CategoryBar>

      <MobileSearchbar>
        <input type="text" placeholder="Search..." />
        <SearchIcon onClick={() => navigate("/addproduct")}>
          <img src="/filter.png" alt="search" />
        </SearchIcon>
      </MobileSearchbar>
    </Container>
  );
}


const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 20px;
  z-index: 100;
  align-items: center;
  transition: transform 0.4s ease;
  transform: ${({ visible }) => (visible ? "translateY(0)" : "translateY(-150%)")};
`;


const Inner = styled.div`
  width: 95%;
  max-width: 1200px;
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  backdrop-filter: blur(10px);
  background: linear-gradient(
    to bottom,
    rgba(37,49,65,255) 0%,
    rgba(45,58,75,255) 60%,
    rgba(54,69,88,255) 100%
  );

  border-radius: 20px;
  box-shadow: 0px 8px 20px rgba(38, 27, 27, 0.3);
  padding: 0 20px;
  position: relative;
`;

const Logo = styled.div`
  margin-left: 20px;
  cursor: pointer;
  img {
    width: 200px;
    margin-top: 10px;
  }
`;

const SearchBar = styled.div`
  height: 35px;
  flex: 1;
  margin: 0px 15px;
  display: flex;
  align-items: center;
  position: relative;

  input {
    flex: 1;
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 5px 0px 0px 5px;

    &::placeholder {
      padding-left: 5px;
    }
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #232f3e;
  display: flex;
  flex-direction: column;
  padding: 5px;
  z-index: 1;
`;

const CategoryButton = styled.button`
  background: transparent;
  color: white;
  border: none;
  margin: 5px;
  font-size: 14px;
  cursor: pointer;
  padding: 5px 10px;

  &:hover {
    text-decoration: underline;
    color: #febd69;
  }
`;

const SearchIcon = styled.div`
  background-color: #febd69;
  height: 106%;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0px 5px 5px 0px;
  img {
    width: 22px;
  }
`;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
  width: fit-content;
  justify-content: space-around;
  height: 100%;
  padding: 5px 15px;
`;

const NavButton = styled.div`
  color: #fff;
  padding: 10px;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  margin-right: 15px;

  p {
    &:nth-child(1) {
      font-size: 12px;
      margin: 0;
    }

    &:nth-child(2) {
      font-size: 14px;
      font-weight: 600;
      margin: 0;
    }
  }
`;

const BasketButton = styled.div`
  display: flex;
  align-items: center;
  height: 90%;
  cursor: pointer;

  img {
    width: 30px;
    margin-right: 10px;
  }

  p {
    color: #fff;
    font-weight: 500;
  }
`;

const CategoryBar = styled.div`
  width: 95%;
  max-width: 1200px;
  background-color: rgba(35, 47, 62, 0.85);
  backdrop-filter: blur(8px);
  margin-top: 10px;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 15px;
  box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.25);
  overflow-x: auto;
  justify-content: flex-start;
`;


const MobileSearchbar = styled.div`
  height: 35px;
  width: 90%;
  display: flex;
  align-items: center;
  padding: 10px;

  input {
    flex: 1;
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 5px 0px 0px 5px;

    &::placeholder {
      padding-left: 10px;
    }
  }

  @media only screen and (min-width: 768px) {
    display: none;
  }
`;

export default Navbar;