import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hook/useAuth";

const PublicRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();
  if (auth) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }else {
    return children;
  }

  //return auth ? <Navigate to="/login"  state={{ from: location }} /> : <Navigate to="/dashboard"  state={{ from: location }} />;
};

export default PublicRoute;