import React from "react";
import { Link } from "@reach/router";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  link: {
    textDecoration: "none",
    color: "white"
  }
});

class NavBar extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit">
            <Link className={classes.link} to="/">
              Pokedex
            </Link>
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(NavBar);
