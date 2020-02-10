import React from "react";

import CurrentUser from "./CurrentUser";
import SignInAndSignUp from "./SignInAndSignUp";
import withUser from "./withUser";

const Authentication = ({ user, loading }) => {
  if (loading) return null;

  return <div>{user ? <CurrentUser {...user} /> : <SignInAndSignUp />}</div>;
};

export default withUser(Authentication);
