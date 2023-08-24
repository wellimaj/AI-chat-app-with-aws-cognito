import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
export default function RequireAuth({ children }: { children: JSX.Element }) {
 const nav = useNavigate();
  useEffect(() => {
   
    if (localStorage.getItem("accesstoken")) return
      nav("/login");
    return;
  }, []);
  return children;
}
