import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Navbar from "./Navbar";
import { useStateValue } from "../StateProvider";
import axios from "../axios";
import { useNavigate } from "react-router-dom";
function Buyer() {
  const [{ user, address }] = useStateValue();
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [buyerInfo, setBuyerInfo] = useState(null);
  useEffect(() => {
    const fetchBuyerInfo = async () => {
      if (!user?.Username) return;
  
      try {
        const response = await axios.get(`/api/buyers/username/${user.Username}`);
        if (response.data.success) {
          setBuyerInfo(response.data.buyer);
        } else {
          alert("Failed to fetch buyer info.");
        }
      } catch (error) {
        console.error("Error fetching buyer info:", error);
        alert(error.response?.data?.message || "Something went wrong.");
      }
    };
  
    fetchBuyerInfo();
  }, [user?.Username]);
  const navigate = useNavigate();
  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword) {
      alert("Both old and new passwords are required.");
      return;
    }
  
    try {
      const response = await axios.put("/api/buyers/change-password", {
        oldPassword,
        newPassword,
        username: user?.Username,
      });
  
      if (response.data.success) {
        alert("Password updated successfully.");
        setShowPasswordPopup(false);
        setOldPassword("");
        setNewPassword("");
        navigate("/");
      } else {
        alert(response.data.message || "Failed to update password.");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <Container>
      <Navbar />
      <Main>
      <h1>Welcome, Buyer!</h1>
      <BuyerInfo>
        <p><strong>Full Name:</strong> {buyerInfo ? `${buyerInfo.First_Name} ${buyerInfo.Last_Name}` : "Loading..."}</p>
        <p><strong>Username:</strong> {buyerInfo?.Username || "Loading..."}</p>
        <p><strong>CNIC:</strong> {buyerInfo?.CNIC || "Not provided"}</p>
        <p><strong>Date of Birth:</strong> {buyerInfo?.DOB ? new Date(buyerInfo.DOB).toLocaleDateString() : "Not provided"}</p>
        <p><strong>Gender:</strong> {buyerInfo?.Gender === 'M' ? 'Male' : buyerInfo?.Gender === 'F' ? 'Female' : 'Other/Not specified'}</p>
        <p><strong>Phone Number:</strong> {buyerInfo?.Phone_NO || "Not provided"}</p>
        <p><strong>Address:</strong> {buyerInfo?.B_Address || "Not provided"}</p>
        <p><strong>Account Type:</strong> Buyer</p>
        <NoteText>
  <em>*Note:</em> In order to update your info, visit our nearest office (Fast-NUCES).
</NoteText>

      </BuyerInfo>


        <ButtonRow>
          <ActionButton onClick={() => setShowPasswordPopup(true)}>
            Change Password
          </ActionButton>
          <ActionButton onClick={() => navigate("/")}>
            Return to Home
          </ActionButton>
          <ActionButton>
            Save Changes
          </ActionButton>
        </ButtonRow>

        <Section>
          <Card onClick={() => navigate("/buyer_order_track")} style={{ cursor: "pointer" }}>
            <h3>Your Orders</h3>
            <p>Track and manage all your orders from here.</p>
          </Card>
        </Section>
      </Main>

      {showPasswordPopup && (
        <PopupOverlay>
          <Popup>
            <h3>Change Password</h3>
            <input
              type="password"
              placeholder="Enter old password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={handlePasswordChange}>Save Changes</button>
          </Popup>
        </PopupOverlay>
      )}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  background-color: rgb(234, 237, 237);
  min-height: 100vh;
`;

const BuyerInfo = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;

  p {
    font-size: 16px;
    margin: 6px 0;
    color: #333;
  }

  strong {
    color: #111;
  }
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

const ButtonRow = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
`;

const ActionButton = styled.button`
  background-color: #ffd814;
  border: 1px solid #fcd200;
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: #f7ca00;
  }
`;

const Section = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const Card = styled.div`
  flex: 1 1 45%;
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
`;

const PopupOverlay = styled.div`
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
`;

const Popup = styled.div`
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  max-width: 400px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);

  h3 {
    margin-bottom: 20px;
  }

  input {
    width: 90%;
    padding: 10px;
    margin-bottom: 15px;
    border-radius: 6px;
    border: 1px solid #ccc;
  }

  button {
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
`;

const NoteText = styled.p`
  font-style: italic;
  font-size: 14px;
  color: #555;
  margin-top: 20px;
`;

export default Buyer;