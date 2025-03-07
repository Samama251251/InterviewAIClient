// import  { useEffect, useState } from "react";
import { UserAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { session } = UserAuth() as { session: Session | null | undefined };

  if (session === undefined) {
    return <div>Loading...</div>;
  }

  return <div>{session ? <>{children}</> : <Navigate to="/signup" />}</div>;
};

export default PrivateRoute;