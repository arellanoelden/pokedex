import React from "react";
import { Link, navigate } from "@reach/router";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import { fade, withStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

const styles = theme => ({
  link: {
    textDecoration: "none",
    color: "white"
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto"
    }
  },
  searchIcon: {
    width: theme.spacing(7),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    color: "inherit"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: 200
    }
  }
});

class NavBar extends React.Component {
  select(e) {
    if (e.target.value) {
      window.location = `/${e.target.value}`;
    }
    console.log("hello");
  }
  render() {
    const { classes } = this.props;
    return (
      <AppBar position="sticky" color="primary">
        <Toolbar variant="dense">
          <Typography variant="h6" color="inherit">
            <Link className={classes.link} to="/">
              Pokedex
            </Link>
          </Typography>
          <div className={classes.search}>
            <Autocomplete
              id="combo-box-demo"
              options={top100Films}
              onSelect={this.select.bind(this)}
              style={{ width: 300 }}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Combo box"
                  variant="outlined"
                  fullWidth
                />
              )}
              renderOption={option => (
                <Link className={classes.link} to={`/${option}`}>
                  {option}
                </Link>
              )}
            />
            {/* <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput
              }}
              inputProps={{ "aria-label": "search" }}
            /> */}
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}

const top100Films = require("./Pokemap").pokeNames();

export default withStyles(styles)(NavBar);
