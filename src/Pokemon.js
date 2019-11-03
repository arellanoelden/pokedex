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

const styles = theme => ({
  link: {
    textDecoration: "none",
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
    fetch(`https://pokeapi.co/api/v2/pokemon/${this.state.id}/`)
      .then(res => res.json())
      .then(response => {
        let name = response.forms[0].name;
        let image = response.sprites.front_default;
        this.setState({
          name,
          loading: false
        });
      })
      .catch(error => console.error("Error:", error));
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
      <Card className="pokemon" id={id}>
        <CardActionArea>
          <CardMedia component="img" image={imageUrl} alt={name} />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {name}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button variant="contained" size="small" color="primary">
            <Link className={classes.link} to={`/${id}`}>
              View
            </Link>
          </Button>
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(styles)(Pokedex);
