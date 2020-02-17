import React, { Component } from "react";
import { signInWithGoogle, signIn } from "../firebase";
import { navigate } from "@reach/router";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";

class SignIn extends Component {
  state = { email: "", password: "", errorMessage: "" };

  handleChange = event => {
    const { name, value } = event.target;

    this.setState({ [name]: value });
    this.googleSignIn = this.googleSignIn.bind(this);
  };

  handleSubmit = event => {
    event.preventDefault();
    const { email, password } = this.state;

    signIn(email, password)
      .then(response => {
        if (response.user) navigate("/");
      })
      .catch(error => {
        console.log("error: ", error);
        this.setState({ errorMessage: "Invalid email and/or password." });
      })
      .finally(() => {
        this.setState({ email: "", password: "" });
      });
  };

  googleSignIn() {
    signInWithGoogle().then(response => {
      if (response.user) navigate("/");
    });
  }

  render() {
    const { email, password, errorMessage } = this.state;

    return (
      <Card className="signCard">
        <form onSubmit={this.handleSubmit} className="signForm">
          <h2>Sign In</h2>
          <TextField
            variant="filled"
            label="Email"
            type="email"
            name="email"
            error={errorMessage.length > 0}
            helperText={errorMessage}
            value={email}
            onChange={this.handleChange}
          />
          <TextField
            variant="filled"
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={this.handleChange}
          />
          <Button variant="contained" type="submit">
            Sign In
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={this.googleSignIn}
          >
            Sign In With Google
          </Button>
        </form>
      </Card>
    );
  }
}

export default SignIn;
