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

class Pokemon extends React.Component {
  constructor(props) {
    super(props);
    this.favoritePokemon = this.favoritePokemon.bind(this);
  }
  favoritePokemon(id) {
    const { uid } = this.props.user;
    firestore.collection(`users/${uid}/favorites`).add({ id });
    firestore.collection("favorites").add({ id });
  }
  render() {
    const {
      classes,
      setCurrentId,
      favorite,
      name,
      id,
      loading,
      user
    } = this.props;

    return (
      <Card className={classes.card} id={`${id}`}>
        <CardActions>
          {user && (
            <IconButton
              aria-label="delete"
              className={classes.margin}
              size="small"
              onClick={() => this.favoritePokemon(id)}
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
            <div
              style={{ height: "10rem" }}
              className={`sprite sprite-${id}`}
            />
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
              <Typography
                className={classes.header}
                gutterBottom
                component="h2"
              >
                {name ? name.charAt(0).toUpperCase() + name.slice(1) : ""}
              </Typography>
            )}
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }
}

export default withStyles(styles)(withUser(Pokemon));
