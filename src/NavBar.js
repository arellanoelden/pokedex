import React from "react";
import { Link } from "@reach/router";

class NavBar extends React.Component {
  render() {
    return (
      <nav>
        <Link to="/">Pokedex!</Link>
      </nav>
    );
  }
}

export default NavBar;
