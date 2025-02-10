import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "../firebase/supabaseClient";

const ProtectedRoute = () => {
  const user = supabase.auth.getUser(); // Check authentication

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
