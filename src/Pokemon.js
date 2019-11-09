import React from "react";
import { Link } from "@reach/router";
import Button from "@material-ui/core/Button";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  CardActions
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

const styles = () => ({
  link: {
    textDecoration: "none",
    color: "white"
  },
  header: {
    textAlign: "center"
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
      name,
      loading: false
    });
  }
  render() {
    if (this.state.loading)
      return (
        <Card className="pokemon" id={id}>
          <CardActionArea>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Loading...
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button variant="contained" size="small" color="primary">
              ...
            </Button>
          </CardActions>
        </Card>
      );
    const { classes } = this.props;
    const { name, id, imageUrl } = this.state;
    return (
      <Link className={classes.link} to={`/${id}`}>
        <Card className="pokemon" id={id}>
          <CardActionArea>
            <CardMedia component="img" image={imageUrl} alt={name} />
            <CardContent>
              <Typography
                className={classes.header}
                gutterBottom
                variant="h4"
                component="h2"
              >
                {name}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Link>
    );
  }
}

export default withStyles(styles)(Pokedex);
