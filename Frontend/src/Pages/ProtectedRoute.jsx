import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("authToken");
      return <Navigate to="/" replace />;
    }
  } catch (err) {
    localStorage.removeItem("authToken");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
