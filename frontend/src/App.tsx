import { createBrowserRouter } from "react-router-dom";

import Chat from "./components/Chat/Chat";

import Home from "./components/Home/Home";
import RequireAuth from "./Utils/RequireAuth";
import Login from "./components/Auth/Login";
import RegisterComponent from "./components/Auth/Register";
// Define your routes using createBrowserRouter
export const App = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
    {
    path: "/register",
    element: <RegisterComponent />,
  },
  {
    path: "/chat",
    element: (
      <RequireAuth>
        <Chat />
      </RequireAuth>
    ),
  },
]);
