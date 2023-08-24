import { useState } from "react";
import { Container, Typography, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchApi } from "../../Utils/api";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import Slide from "@mui/material/Slide";
import {useEffect} from 'react'
const StyledContainer = styled(Container)`
  background-image: url("https://blogs.microsoft.com/wp-content/uploads/prod/2023/06/OMB-AI-Blog-Image_06.08.23-2048x1152.jpg");
  background-size: cover;
  background-position: center;
  height: 100vh;
  width: 100vw;
  max-width: 100vw !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledForm = styled("form")`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: auto;
  max-width: 80%;
  padding: 30px;
  background: #fff;
  border-radius: 4px;
`;

const RegisterComponent = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verify, setVerify] = useState(false);
  const [code, setCode] = useState("");
  const nav = useNavigate();
  const handleRegister = () => {
    // Handle registration logic here
    console.log("Username:", username);
    console.log("Email:", email);
    console.log("Password:", password);
    if (!verify) {
      fetchApi("auth/register", "POST", { username, password, email }, {}).then(
        (res) => {
          if (res.status == 200) {
            setVerify(true);
          }
        }
      );
    } else {
      fetchApi("auth/verify", "POST", { username, password, code }, {}).then(
        (res) => {
          if (res.status == 200) {
            setVerify(false);
            fetchApi("auth/login", "POST", { username, password }, {}).then(
              (res) => {
                console.log(res, "login");
                if (res.status == 200) {
                  localStorage.setItem("accesstoken", res.data.AccessToken);
                  nav("/chat");
                }
              }
            );
          }
        }
      );
    }
  };
useEffect(() => {
  if (localStorage.getItem("accesstoken")) nav("/chat");;
  
  return;
}, []);
  return (
    <StyledContainer>
      <Typography variant="h2">Get Started</Typography>
      <StyledForm
        onSubmit={(e) => {
          e.preventDefault();
          handleRegister();
        }}
      >
        <TextField
          helperText="Username"
          autoComplete="on"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          helperText="Email"
          type="email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          helperText="Password"
          type="password"
          variant="outlined"
          autoComplete="on"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {verify && (
          <Slide in={verify}>
            <TextField
              helperText="Code sent to your email"
              type="password"
              variant="outlined"
              autoComplete="on"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </Slide>
        )}
        <Button variant="contained" color="primary" type="submit">
          {verify ? "verify" : "Register"}
        </Button>
      </StyledForm>
      <Link to="/login"> Already registered?</Link>
    </StyledContainer>
  );
};

export default RegisterComponent;
