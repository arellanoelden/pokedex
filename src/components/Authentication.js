import React from "react";

import CurrentUser from "./CurrentUser";
import SignInAndSignUp from "./SignInAndSignUp";
import withUser from "./withUser";
import Navbar from "./NavBar";
const Authentication = ({ user, loading }) => {
  if (loading) return null;

  return (
    <div>
      <Navbar />
      {user ? <CurrentUser {...user} /> : <SignInAndSignUp />}
    </div>
  );
};

export default withUser(Authentication);
