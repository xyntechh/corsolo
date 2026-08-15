import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const GuestRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");

  if (token) {
    try {
      const decoded = jwtDecode(token);

     
      if (decoded.isGuest === false) {
        return <Navigate to="/homeClone" replace />;
      }

    } catch (error) {
      console.error("Invalid Token:", error);
      localStorage.removeItem("authToken");
    }
  }

  return children;
};

export default GuestRoute;