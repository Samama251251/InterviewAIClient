// import  { useEffect, useState } from "react";
import { UserAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isPending } = UserAuth();

  if (isPending) {
    return <div>Loading session...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;