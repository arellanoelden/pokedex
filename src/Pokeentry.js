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
import Breadcrumbs from "@material-ui/core/Breadcrumbs";

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
    },
    backgroundColor: theme.palette.primary.main
  },
  imgChain: {
    height: "4rem",
    marginRight: "1rem"
  }
});

class Pokeentry extends React.Component {
  constructor(props) {
    super(props);
    const map = require("./Pokemap.js").objectMap();
    const id = isNaN(this.props.id) ? map[this.props.id] : this.props.id;
    this.state = {
      loading: true,
      id,
      imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
    };
    this.handlePokemon = this.handlePokemon.bind(this);
    this.setPokeInfo = this.setPokeInfo.bind(this);
  }
  componentDidMount() {
    this.setPokeInfo(this.state.id);
  }
  setPokeInfo = id => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
      .then(res => res.json())
      .then(response => {
        let name = response.name;
        let types = response.types;
        types.forEach(type => {
          const typeUrl = type.type.url;
          fetch(typeUrl)
            .then(res => res.json())
            .then(response => {
              console.log(response);
            });
          console.log(type.type.url);
        });
        this.setState({
          name,
          types,
          loading: false
        });
      })
      .catch(error => console.error("Error:", error));

    fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
      .then(res => res.json())
      .then(response => {
        let flavorIndex = 1;
        const flavorEntries = response.flavor_text_entries;
        while (
          flavorEntries[flavorIndex] &&
          flavorEntries[flavorIndex].language.name !== "en"
        ) {
          flavorIndex++;
        }
        this.setState({
          description: flavorEntries[flavorIndex].flavor_text
        });

        fetch(response.evolution_chain.url)
          .then(res => res.json())
          .then(response => {
            let chain = [];
            let chains = response.chain.evolves_to;
            let chainId = 0;
            if (chains) {
              // starting ID not given
              const index = response.chain.species.url.split("/");
              chainId = index[index.length - 2];

              chain.push({
                name: response.chain.species.name,
                url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${chainId}.png`,
                pokeId: chainId
              });
              while (chains[0] && chains[0].evolves_to) {
                chainId++;
                chain.push({
                  name: chains[0].species.name,
                  url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${chainId}.png`,
                  pokeId: chainId
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
  };
  handlePokemon = id => {
    return () => {
      this.setState({
        id,
        imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
      });
      this.setPokeInfo(id);
    };
  };
  render() {
    if (this.state.loading) return <h1>loading ... </h1>;
    const { name, imageUrl, id, types, description } = this.state;
    const { classes } = this.props;
    return (
      <div className="pokedex-container" style={{ padding: 15 }}>
        <Card className="pokemon" style={{ padding: 10 }} id={id}>
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
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              {this.state.chain
                ? this.state.chain.map((evolution, index) => {
                    return (
                      <div
                        key={index}
                        style={{ padding: 0 }}
                        role="link"
                        onClick={this.handlePokemon(evolution.pokeId)}
                      >
                        <img
                          className={classes.imgChain}
                          src={evolution.url}
                          alt={evolution.name}
                        />
                        {evolution.pokeId}
                        {evolution.name}
                      </div>
                    );
                  })
                : ""}
            </Breadcrumbs>
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(Pokeentry);
