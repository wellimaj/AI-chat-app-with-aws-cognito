import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const HomeContainer = styled("div")`
  background-image: url("https://blogs.microsoft.com/wp-content/uploads/prod/2023/06/OMB-AI-Blog-Image_06.08.23-2048x1152.jpg");
  background-size: cover;
  background-position: center;
  height: 100vh;
  width:100vw;
`;

const Header = styled("header")`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
`;

const LoginButton = styled(Button)`
  && {
    text-decoration: none;
    color: white;
    font-weight: bold;
  }
`;

const GetStartedCard = styled(Paper)`
  && {
    background-color: rgba(255, 255, 255, 0.9);
    padding: 16px;
    border-radius: 8px;
    max-width: 300px;
    margin: 50px auto;
    text-align: center;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

export default function Home() {
  return (
    <HomeContainer>
      <Header>
        <Typography variant="h4">AI Chat bot</Typography>
        <LoginButton href="/login" variant="contained">
          Login
        </LoginButton>
      </Header>
      <GetStartedCard elevation={3}>
        <Typography variant="h5">Get Started for Free</Typography>
        <Typography variant="body1">
          Join our AI-powered chat platform today!
        </Typography>
        <LoginButton href="/register" variant="contained">
          Sign Up
        </LoginButton>
      </GetStartedCard>
    </HomeContainer>
  );
}
