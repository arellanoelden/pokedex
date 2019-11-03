import React from "react";
import { render } from "react-dom";
import { Router } from "@reach/router";
import NavBar from "./NavBar";
import Pokedex from "./Pokedex";
import Pokeentry from "./Pokeentry";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <NavBar />
        <Router>
          <Pokedex path="/" />
          <Pokeentry path="/:id" />
        </Router>
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
