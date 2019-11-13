import React from "react";
import { Router } from "@reach/router";
import NavBar from "./NavBar";
import Pokedex from "./Pokedex";
import Pokeentry from "./Pokeentry";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { red, orange } from "@material-ui/core/colors";
import "./styles/style.css";

const outerTheme = createMuiTheme({
  palette: {
    primary: red,
    secondary: {
      main: orange[500]
    }
  }
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <ThemeProvider theme={outerTheme}>
        <div>
          <NavBar />
          <Router>
            <Pokedex path="/" />
            <Pokeentry path="/:id" />
          </Router>
        </div>
      </ThemeProvider>
    );
  }
}

export default App;
