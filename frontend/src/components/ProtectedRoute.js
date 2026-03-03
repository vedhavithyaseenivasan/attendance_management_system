import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { CircularProgress, Box } from "@mui/material";

const ProtectedRoute = ({ children, roles = [] }) => {
  const location = useLocation();
  const { token, role, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  //Only check token
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  //Role-based check
  if (roles.length > 0 && !roles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;