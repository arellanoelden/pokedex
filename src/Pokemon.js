import React from "react";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Skeleton from "@material-ui/lab/Skeleton";

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
      height: 350
    },
    [theme.breakpoints.up("xl")]: {
      height: 400
    }
  },
  card: {
    backgroundColor: theme.palette.secondary.main,
    color: "white"
  }
});

class Pokedex extends React.Component {
  state = {
    loading: true,
    imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
      this.props.id
    }.png`,
    id: this.props.id
  };
  componentDidMount() {
    const nameMap = require("./Pokemap").objectMap();
    const name = nameMap[this.props.id];
    this.setState({
      name
    });
  }
  handleImageLoaded() {
    this.setState({
      loading: false
    });
  }
  render() {
    const { classes, setCurrentId } = this.props;
    const { name, id, imageUrl, loading } = this.state;
    return (
      <Card className={classes.card} id={`${id}`}>
        <CardActionArea onClick={() => setCurrentId(id)}>
          <CardMedia
            component="img"
            onLoad={this.handleImageLoaded.bind(this)}
            image={imageUrl}
            alt={name}
          />
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
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
            )}
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }
}

export default withStyles(styles)(Pokedex);
