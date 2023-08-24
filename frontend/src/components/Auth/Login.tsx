import { useState } from "react";
import { Container, Typography, TextField, Button } from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { fetchApi } from "../../Utils/api";
import { useEffect } from "react";
import { Link } from "react-router-dom";
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

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();
  const handleRegister = () => {
    // Handle registration logic here
    fetchApi("auth/login", "POST", { username, password }, {}).then((res) => {
      if (res.status == 200) {
        localStorage.setItem("accesstoken", res.data.AccessToken);
        nav("/chat");
      }
    });
  };
  useEffect(() => {
    if (localStorage.getItem("accesstoken")) nav("/chat");
    return;
  }, []);
  return (
    <StyledContainer>
      <Typography variant="h2">Sign In</Typography>
      <StyledForm
        onSubmit={(e) => {
          e.preventDefault();
          handleRegister();
        }}
      >
        <TextField
          helperText="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          helperText="Password"
          type="password"
          variant="outlined"
          autoComplete="on"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" color="primary" type="submit">
          Login
        </Button>
      </StyledForm>
      <Link to="/register"> not registered? register here</Link>
    </StyledContainer>
  );
};

export default Login;
