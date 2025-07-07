import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
//import { Form } from "react-router-dom";
import styled from "styled-components";
import axios from "../axios";
import { useStateValue } from "../StateProvider";
function Login(){
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
    const navigate = useNavigate();
    const [{}, dispatch] = useStateValue();
    const handleLogin = (e) => {
      e.preventDefault();
    
      const loginData = {
        username,
        password,
        userType,
      };
    
      axios
        .post("/api/login", loginData)
        .then((res) => {
          if (res.data.success) {
            alert("Login successful!");
            console.log("Login successful:", res.data.user);
            dispatch({
              type: "SET_USER",
              user: res.data.user,
            });
            
            sessionStorage.setItem('user', JSON.stringify(res.data.user));
            localStorage.setItem("user", JSON.stringify(res.data.user));
            if (loginData.userType === "buyer"){
              navigate("/");
            }
            else{
              navigate("/seller");
            }
          } else {
            alert(res.data.message || "Login failed.");
          }
        })
        .catch((err) => {
          console.error(err);
          alert(
            err.response?.data?.message ||
            "Login failed. Please check your credentials."
          );
        });
    };
    
    
    return (
        <Container>
            <Logo onClick={() => navigate("/")}>
                <img src="./Byzaar.jpg" alt="" />
            </Logo>
            <FormContainer>
                <h3>Sign-In</h3>
                <InputContainer>
                   <p>Username</p>
                   <input type="text" placeholder="exampe@example.com" onChange={(e) => setUsername(e.target.value)} value={username}/>
                </InputContainer>
                <InputContainer>
                   <p>Password</p>
                   <input type="password" placeholder="********" onChange={(e) => setPassword(e.target.value)} value={password}/>
                </InputContainer>
                <InputContainer>
                  <p>Usertype</p>
                  <select onChange={(e) => setUserType(e.target.value)} value={userType}>
                    <option value="" disabled>Select user type</option>
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                  </select>
                </InputContainer>

                <LoginButton onClick={handleLogin}>Login</LoginButton>

                <InfoText>
                    By continuing, you agree to Byzaar's <span>Conditions of Use </span>
                    and <span> Privacy Notice</span>
                </InfoText>
            </FormContainer>
            <SignUpButton onClick={() => navigate("/signup")}>Register Byzaar</ SignUpButton>
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
    width:200px;
    img {
      width: 100%;
    }
`;
const FormContainer = styled.form`
     border: 1px solid lightgray;
  width: 55%;
  height: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px;

  h3 {
    font-size: 28px;
    font-weight: 400;
    line-height: 33px;
    align-self: flex-start;

    margin-bottom: 10px;
  }
`;

const InputContainer = styled.div`
  width: 100%;
  padding: 10px;

  p {
    font-size: 14px;
    font-weight: 600;
  }

  input,
  select {
    width: 95%;
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


const LoginButton = styled.button`
  width: 70%;
  height: 35px;
  background-color: #f3b414;
  border: none;
  outline: none;
  border-radius: 10px;
  margin-top: 30px;
`;


const InfoText = styled.p`
  font-size: 12px;
  width: 100%;
  word-wrap: normal;
  word-break: normal;
  margin-top: 20px;

  span {
    color: #426bc0;
  }
`;


const SignUpButton = styled.button`
  width: 55%;
  height: 35px;
  font-size: 12px;
  margin-top: 20px;

  &:hover {
    background-color: #dfdfdf;
    border: 1px solid gray;
  }
`;
export default Login;
