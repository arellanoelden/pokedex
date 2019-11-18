import React from "react";
import { Link, navigate } from "@reach/router";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import { fade, withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

const styles = theme => ({
  link: {
    textDecoration: "none",
    color: "white",
    marginRight: "1rem"
  },
  option: {
    width: "100%"
  },
  autocomplete: {
    backgroundColor: theme.palette.secondary.main
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
    color: "white"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: 200
    }
  },
  toolbar: {
    paddingTop: "0.5rem",
    paddingBottom: "0.5rem",
    justifyContent: "space-between"
  }
});

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.map = require("./Pokemap").objectMap();
  }
  select(e) {
    if (e && e.target.textContent && this.map[e.target.textContent]) {
      navigate(`/${e.target.textContent}`);
    }
  }
  render() {
    const { classes } = this.props;
    return (
      <AppBar position="sticky" color="primary">
        <Toolbar variant="dense" className={classes.toolbar}>
          <Typography variant="h6" color="inherit">
            <Link className={classes.link} to="/">
              Pokedex
            </Link>
          </Typography>
          <div className={classes.search}>
            <Autocomplete
              id="combo-box-demo"
              options={pokeNames}
              style={{ minWidth: 300 }}
              onInputChange={this.select.bind(this)}
              renderInput={params => (
                <TextField
                  {...params}
                  placeholder="Search"
                  variant="outlined"
                  className={classes.link}
                  onSubmit={this.select.bind(this)}
                  fullWidth
                />
              )}
              renderOption={option => (
                <p className={classes.option} onClick={this.select.bind(this)}>
                  {option}
                </p>
              )}
            />
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}

const pokeNames = require("./Pokemap").pokeNames();

export default withStyles(styles)(NavBar);
