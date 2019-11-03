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
import Chip from "@material-ui/core/Chip";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

const styles = theme => ({
  link: {
    textDecoration: "none",
    color: "white"
  },
  img: {
    width: "80%",
    marginLeft: "10%",
    [theme.breakpoints.up("md")]: {
      width: "50%",
      marginLeft: "0%"
    },
    [theme.breakpoints.up("lg")]: {
      width: "30%"
    }
  },
  card: {
    [theme.breakpoints.up("md")]: {
      display: "flex",
      justifyContent: "flex-start"
    }
  },
  imgChain: {
    height: "4rem",
    marginRight: "1rem"
  }
});

class Pokeentry extends React.Component {
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
        let name = response.name;
        let types = response.types;
        this.setState({
          name,
          types,
          loading: false
        });
      })
      .catch(error => console.error("Error:", error));

    fetch(`https://pokeapi.co/api/v2/pokemon-species/${this.state.id}`)
      .then(res => res.json())
      .then(response => {
        this.setState({
          description: response.flavor_text_entries[1].flavor_text
        });

        fetch(response.evolution_chain.url)
          .then(res => res.json())
          .then(response => {
            let chain = [];
            let chains = response.chain.evolves_to;
            let chainId = 0;
            if (chains) {
              chainId = response.chain.species.url.charAt(
                response.chain.species.url.length - 2
              );
              chain.push({
                name: response.chain.species.name,
                url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${chainId}.png`
              });
              while (chains[0] && chains[0].evolves_to) {
                chainId++;
                chain.push({
                  name: chains[0].species.name,
                  url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${chainId}.png`
                });
                chains = chains[0].evolves_to;
              }
              this.setState({
                chain
              });
            }
          })
          .catch(error => console.error("Error:", error));
      });
  }
  render() {
    if (this.state.loading) return <h1>loading ... </h1>;
    const { name, imageUrl, id, types, description } = this.state;
    const { classes } = this.props;
    return (
      <div className="pokedex-container" style={{ padding: 15 }}>
        <Card
          className="pokemon ${classes.imgChain}"
          style={{ padding: 10 }}
          id={id}
        >
          <CardActionArea className={classes.card}>
            <CardMedia
              className={classes.img}
              component="img"
              image={imageUrl}
              alt={name}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {name}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {description}
              </Typography>
              {types.map((type, index) => {
                return (
                  <Chip
                    key={index}
                    style={{ marginRight: 10, marginTop: 10 }}
                    label={type.type.name}
                  />
                );
              })}
              <List>
                {this.state.chain
                  ? this.state.chain.map((evolution, index) => {
                      return (
                        <ListItem key={index} style={{ padding: 0 }}>
                          <img
                            className={classes.imgChain}
                            src={evolution.url}
                            alt={evolution.name}
                          />
                          {evolution.name}
                        </ListItem>
                      );
                    })
                  : ""}
              </List>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button variant="contained" size="small" color="primary">
              <Link className={classes.link} to={`/#${id}`}>
                Back
              </Link>
            </Button>
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(Pokeentry);
