import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardActions,
  IconButton
} from "@material-ui/core";
import FavoriteIcon from "@material-ui/icons/Favorite";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Skeleton from "@material-ui/lab/Skeleton";
import { firestore } from "../firebase";
import withUser from "./withUser";

const styles = theme => ({
  link: {
    textDecoration: "none",
    color: "white"
  },
  header: {
    textAlign: "center",
    fontSize: "1rem"
  },
  skeleton: {
    marginBottom: "0.75rem",
    height: 75,
    [theme.breakpoints.up("md")]: {
      height: 100
    },
    [theme.breakpoints.up("xl")]: {
      height: 125
    }
  },
  card: {
    backgroundColor: theme.palette.secondary.main,
    color: "white"
  }
});

const Pokemon = ({
  classes,
  setCurrentId,
  favorite,
  name,
  id,
  loading,
  user
}) => {
  const favoritePokemon = id => {
    const { uid } = user;
    if (!favorite) {
      firestore
        .collection(`users/${uid}/favorites`)
        .doc(`${id}`)
        .set({ id });
    } else {
      firestore
        .collection(`users/${uid}/favorites`)
        .doc(`${id}`)
        .delete();
    }
  };

  return (
    <Card className={classes.card} id={`${id}`}>
      <CardActions>
        {user && (
          <IconButton
            aria-label="delete"
            className={classes.margin}
            size="small"
            onClick={() => favoritePokemon(id)}
          >
            <FavoriteIcon color={favorite ? "primary" : "inherit"} />
          </IconButton>
        )}
      </CardActions>
      <CardActionArea onClick={() => setCurrentId(id)}>
        {loading ? (
          <Skeleton
            variant="rect"
            width="100%"
            height="3rem"
            className="sprite"
          />
        ) : (
          <div className={`sprite sprite-${id}`} />
        )}
        <CardContent style={{ padding: 0 }}>
          {loading ? (
            <React.Fragment>
              <Skeleton
                variant="rect"
                width="100%"
                className={classes.skeleton}
              />
              <Skeleton variant="rect" width="100%" />
            </React.Fragment>
          ) : (
            <Typography className={classes.header} gutterBottom component="h2">
              {name ? name.charAt(0).toUpperCase() + name.slice(1) : ""}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default withStyles(styles)(withUser(Pokemon));
