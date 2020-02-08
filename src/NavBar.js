import React from "react";
import { Link } from "@reach/router";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const styles = theme => ({
  link: {
    textDecoration: "none",
    color: "white"
  },
  option: {
    width: "100%"
  },
  autocomplete: {
    backgroundColor: theme.palette.secondary.main
  },
  search: {
    marginLeft: 0,
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
    this.filter = this.filter.bind(this);
  }
  filter(e) {
    if (e && e.target.value !== null) {
      let pokeIdsFiltered = pokeNames
        .filter(pokemon => pokemon.includes(e.target.value))
        .map(pokemon => this.map[pokemon]);
      console.log(pokeIdsFiltered);
      this.props.setIds(pokeIdsFiltered);
    }
  }
  render() {
    const { classes } = this.props;
    return (
      <AppBar color="primary" position="sticky">
        <Toolbar variant="dense" className={classes.toolbar}>
          <Typography variant="h6" color="inherit">
            <Link className={classes.link} to="/">
              Pokedex
            </Link>
          </Typography>
          <div className={classes.search}>
            <TextField
              id="filled-basic"
              label="Search"
              variant="filled"
              onChange={this.filter}
            />
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}

const pokeNames = require("./Pokemap").pokeNames();

export default withStyles(styles)(NavBar);
