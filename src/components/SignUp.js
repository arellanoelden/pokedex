import React, { Component } from "react";
import { auth, createUserProfileDocument } from "../firebase";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import { navigate } from "@reach/router";

class SignUp extends Component {
  state = { displayName: "", email: "", password: "" };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async event => {
    event.preventDefault();

    const { email, password, displayName } = this.state;
    try {
      const { user } = await auth.createUserWithEmailAndPassword(
        email,
        password
      );

      createUserProfileDocument(user, { displayName }).then(response => {
        if (response.id) navigate("/");
      });
    } catch (error) {
      console.error(error);
    }

    this.setState({ displayName: "", email: "", password: "" });
  };

  render() {
    const { displayName, email, password } = this.state;

    return (
      <Card className="signCard">
        <form onSubmit={this.handleSubmit} className="signForm">
          <h2>Sign Up</h2>
          <TextField
            variant="filled"
            label="Display Name"
            type="text"
            name="displayName"
            value={displayName}
            onChange={this.handleChange}
          />
          <TextField
            variant="filled"
            label="Email"
            type="email"
            name="email"
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
            Sign Up
          </Button>
        </form>
      </Card>
    );
  }
}

export default SignUp;
