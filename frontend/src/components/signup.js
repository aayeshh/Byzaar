import React, { useState } from "react";
import styled from "styled-components";
import axios from "../axios";
import { useNavigate } from "react-router-dom";
function SignUp() {

  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setdob] = useState("");
  const [cnic, setcnic] = useState("");
  const [gender, setgender] = useState("");
  const [phone, setphone] = useState("");
  const [address, setaddress] = useState("");
  const [type, setype] = useState("");
  const signup = (e) => {
    e.preventDefault();

    // ✅ Age check
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    const isOldEnough = age > 16 || (age === 16 && m >= 0);
    if (!isOldEnough) {
      alert("You must be at least 16 years old to sign up.");
      return;
    }

    // ✅ CNIC validation (13 digits)
    if (!/^\d{13}$/.test(cnic)) {
      alert("Please enter a valid 13-digit CNIC.");
      return;
    }

    // ✅ Phone validation (03xxxxxxxxx or +92xxxxxxxxxx)
    if (!/^(\+92|03)\d{9}$/.test(phone)) {
      alert("Please enter a valid phone number starting with +92 or 03.");
      return;
    }

    // ✅ Address check (at least 10 characters)
    if (address.length < 10) {
      alert("Address must be at least 10 characters long.");
      return;
    }

    const userData =
      type === "buyer"
        ? {
          First_Name: firstName,
          Last_Name: lastName,
          CNIC: cnic,
          DOB: dob,
          Gender: gender,
          Phone_NO: phone,
          B_Address: address,
          Username: username,
          B_Password: password,
        }
        : {
          First_Name: firstName,
          Last_Name: lastName,
          CNIC: cnic,
          DOB: dob,
          Gender: gender,
          Phone_NO: phone,
          S_Address: address,
          Username: username,
          S_Password: password,
        };

    let endpoint = "";
    if (type === "buyer") {
      endpoint = "/api/buyers";
    } else if (type === "seller") {
      endpoint = "/api/sellers";
    } else {
      alert("Please select a valid user type.");
      return;
    }

    axios
      .post(endpoint, userData)
      .then((res) => {
        alert(res.data.message || "Signup successful!");
        navigate("/login");
      })
      .catch((err) => {
        console.warn(err);
        alert(err.response?.data?.message || "Signup failed. Please try again.");
      });
  };


  return (
    <Container>
      <Logo>
        <img src="./Byzaar.jpg" alt="" />
      </Logo>
      <FormContainer>
        <h3>Sign-Up</h3>
        <FormGrid>
          <InputContainer>
            <p>First Name</p>
            <input type="text" placeholder="John" onChange={(e) => setFirstName(e.target.value)} value={firstName} />
          </InputContainer>
          <InputContainer>
            <p>Last Name</p>
            <input type="text" placeholder="Smith" onChange={(e) => setlastName(e.target.value)} value={lastName} />
          </InputContainer>
          <InputContainer>
            <p>Username</p>
            <input type="text" placeholder="example@example.com" onChange={(e) => setusername(e.target.value)} value={username} />
          </InputContainer>
          <InputContainer>
            <p>Password</p>
            <input type="password" placeholder="********" onChange={(e) => setPassword(e.target.value)} value={password} />
          </InputContainer>
          <InputContainer>
            <p>CNIC</p>
            <input type="text" placeholder="35***********" onChange={(e) => setcnic(e.target.value)} value={cnic} />
          </InputContainer>
          <InputContainer>
            <p>DOB</p>
            <input type="date" placeholder="YYYY-MM-DD" onChange={(e) => setdob(e.target.value)} value={dob} />
          </InputContainer>
          <InputContainer>
            <p>Gender</p>
            <select onChange={(e) => setgender(e.target.value)} value={gender}>
              <option value="">Select Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
            </select>
          </InputContainer>
          <InputContainer>
            <p>Phone Number</p>
            <input type="text" placeholder="+92***" onChange={(e) => setphone(e.target.value)} value={phone} />
          </InputContainer>
          <InputContainer>
            <p>Address</p>
            <input type="text" placeholder="ABC street" onChange={(e) => setaddress(e.target.value)} value={address} />
          </InputContainer>
          <InputContainer>
            <p>User Type</p>
            <select onChange={(e) => setype(e.target.value)} value={type}>
              <option value="">Select Type</option>
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
          </InputContainer>

        </FormGrid>
        <SignUpButton onClick={signup}>Sign Up</SignUpButton>
      </FormContainer>

      <LoginButton onClick={() => navigate("/login")}>Back to Login Page</ LoginButton>
    </Container>
  )
}

const Container = styled.div`
  width: 40%;
  min-width: 450px;
  height: fit-content;
  padding: 15px;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Logo = styled.div`
  width: 200px;
  margin-bottom: 20px;
  img {
    width: 100%;
  }
`;

const FormGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
`;

const FormContainer = styled.form`
  border: 1px solid lightgray;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px;
  overflow-y:auto;
  h3 {
    font-size: 28px;
    font-weight: 400;
    line-height: 33px;
    align-self: flex-start;

    margin-bottom: 10px;
  }
`;

const InputContainer = styled.div`
  width: 48%;
  margin-bottom: 10px;

  p {
    font-size: 14px;
    font-weight: 600;
  }
  select {
  width: 100%;
  height: 33px;
  padding-left: 5px;
  border-radius: 5px;
  border: 1px solid lightgray;
  margin-top: 5px;

  &:hover {
    border: 1px solid orange;
  }
}

  input {
    width: 100%;
    height: 33px;
    padding-left: 5px;
    border-radius: 5px;
    border: 1px solid lightgray;
    margin-top: 5px;

    &:hover {
      border: 1px solid orange;
    }
  }
`;


const SignUpButton = styled.button`
  width: 100%;
  height: 35px;
  font-size: 12px;
  margin-top: 20px;

  &:hover {
   
    background-color: #f3b414;
    border: 1px solid gray;
  }
`;

const LoginButton = styled.button`
  width: 55%;
  height: 35px;
  background-color: #dfdfdf;
  border: none;
  outline: none;
  border-radius: 10px;
  margin-top: 30px;
`;


export default SignUp