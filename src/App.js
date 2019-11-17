import React from "react";
import { Router } from "@reach/router";
import NavBar from "./NavBar";
import Pokedex from "./Pokedex";
import Pokeentry from "./Pokeentry";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { red, cyan, grey } from "@material-ui/core/colors";
import "./styles/style.css";
import useMediaQuery from "@material-ui/core/useMediaQuery";

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          primary: {
            main: red[400]
          },
          secondary: {
            main: prefersDarkMode ? grey[800] : cyan[300]
          },
          third: {
            main: "#FFF"
          },
          type: prefersDarkMode ? "dark" : "light"
        }
      }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
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

export default App;
