import React from "react";
import { signOut } from "../firebase";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";

const CurrentUser = ({ displayName, photoURL, email, children }) => {
  return (
    <section className="currentUser">
      <Card className="currentUser-card">
        <div className="currentUser--information">
          <h2>{displayName}</h2>
          <p className="email">{email}</p>
        </div>
        <div>
          <div>{children}</div>
          <Button color="secondary" variant="contained" onClick={signOut}>
            Sign Out
          </Button>
        </div>
      </Card>
    </section>
  );
};

CurrentUser.defaultProps = {
  displayName: "Bill Murray",
  email: "billmurray@mailinator.com",
  photoURL: "https://www.fillmurray.com/300/300"
};

export default CurrentUser;
