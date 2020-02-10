import React from "react";
import { Router } from "@reach/router";
import Pokedex from "./Pokedex";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { red, cyan, grey } from "@material-ui/core/colors";
import "../styles/style.css";
import "../styles/sprites.css";
import Authentication from "./Authentication";
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
      <Router>
        <Pokedex path="/" />
        <Authentication path="profile" />
      </Router>
    </ThemeProvider>
  );
}

export default App;
