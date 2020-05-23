import React, { useState } from "react";
import { navigate } from "@reach/router";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import TextField from "@material-ui/core/TextField";
import { firestore } from "../firebase";
import { pokeIds } from "../Pokemap";
import withUser from "./withUser";
import withPokeIds from "./withPokeIds";
import { Match } from "@reach/router";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import FavoriteIcon from "@material-ui/icons/Favorite";
import HomeIcon from "@material-ui/icons/Home";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import ViewModule from "@material-ui/icons/ViewModule";
import Assessment from "@material-ui/icons/Assessment";
import { pokeNames, objectMap } from "../Pokemap";

const NavBar = props => {
  const map = objectMap;
  const ids = pokeIds;
  const [showFavorites, setShowFavorites] = useState(false);
  const [navActive, setNavActive] = useState(false);
  const [search, setSearch] = useState("");
  const { user } = props;

  function filter(e) {
    setSearch(e.currentTarget.value);
    if (search === "") {
      props.setIds(ids);
    }
    if (search !== null) {
      let pokeIdsFiltered = pokeNames
        .filter(pokemon => pokemon.includes(e.target.value))
        .map(pokemon => map[pokemon]);
      props.setIds(pokeIdsFiltered);
    }
  }
  function profileNavigate() {
    setNavActive(false);
    navigate("/profile");
  }

  function homeNavigate() {
    if (showFavorites) {
      props.setIds(ids);
    }
    navigate("/");
    setNavActive(false);
  }

  function teamsNavigate() {
    navigate("/teams");
    setNavActive(false);
  }

  function teamsBuilderNavigate() {
    navigate("/teamBuilder");
    setNavActive(false);
  }

  function displayFavorites() {
    const { uid } = props.user;
    firestore
      .collection(`users/${uid}/favorites`)
      .get()
      .then(snapshot => {
        const favorites = [];
        snapshot.forEach(doc => {
          favorites.push(doc.data().id);
        });
        favorites.sort((a, b) => a - b);
        props.setIds(favorites);
        setShowFavorites(true);
        navigate("/");
        setNavActive(false);
      });
  }

  return (
    <React.Fragment>
      <List
        component="nav"
        aria-label="main mailbox folders"
        className={navActive ? "pokeNav active" : "pokeNav"}
      >
        <ListItem
          button
          onClick={() => homeNavigate()}
          style={{ marginTop: "1.5rem" }}
        >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        {user && (
          <ListItem button onClick={() => displayFavorites()}>
            <ListItemIcon>
              <FavoriteIcon />
            </ListItemIcon>
            <ListItemText primary="Favorites" />
          </ListItem>
        )}
        {user && (
          <ListItem button onClick={() => teamsNavigate()}>
            <ListItemIcon>
              <ViewModule />
            </ListItemIcon>
            <ListItemText primary="Teams" />
          </ListItem>
        )}
        <ListItem button onClick={() => teamsBuilderNavigate()}>
          <ListItemIcon>
            <Assessment />
          </ListItemIcon>
          <ListItemText primary="Team Checker" />
        </ListItem>
        <ListItem button onClick={() => profileNavigate()}>
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <ListItemText primary={user ? "Profile" : "Login/Register"} />
        </ListItem>
      </List>
      <AppBar color="primary" position="sticky">
        <Toolbar variant="dense" style={{ justifyContent: "space-between" }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setNavActive(!navActive)}
          >
            <MenuIcon />
          </IconButton>
          <Match path="/">
            {props =>
              props.match && (
                <div>
                  <TextField
                    id="filled-basic"
                    label="Search"
                    variant="filled"
                    color="secondary"
                    value={search}
                    onChange={e => filter(e)}
                  />
                </div>
              )
            }
          </Match>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default withUser(withPokeIds(NavBar));
