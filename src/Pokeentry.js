import React from "react";
import { Link, navigate } from "@reach/router";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Skeleton from "@material-ui/lab/Skeleton";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

const styles = theme => ({
  link: {
    textDecoration: "none",
    color: "white"
  },
  img: {
    width: "80%",
    marginLeft: "10%",
    [theme.breakpoints.up("md")]: {
      width: "30%",
      marginLeft: "0%"
    }
  },
  skeletonImg: {
    width: "80%",
    height: 360,
    marginLeft: "10%",
    [theme.breakpoints.up("md")]: {
      height: 370,
      width: "30%",
      marginLeft: "0%"
    }
  },
  cardContent: {
    [theme.breakpoints.up("md")]: {
      display: "flex",
      justifyContent: "flex-start",
      flexWrap: "wrap"
    }
  },
  card: {
    padding: 10,
    backgroundColor: theme.palette.secondary.main
  },
  breadcrumbs: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  type: {
    marginRight: 10,
    marginTop: 10,
    borderRadius: "0",
    color: "#FFF",
    width: "10rem"
  }
});

class Pokeentry extends React.Component {
  constructor(props) {
    super(props);
    window.scrollTo(70, 70);
    const maps = require("./Pokemap.js");
    const map = maps.objectMap();
    const colors = maps.typeColor();
    const id = isNaN(this.props.id) ? map[this.props.id] : this.props.id;
    this.typeMaps = maps.typeAdvantages();
    const allTypes = [
      { name: "bug", damage: 1 },
      { name: "dark", damage: 1 },
      { name: "dragon", damage: 1 },
      { name: "electric", damage: 1 },
      { name: "fairy", damage: 1 },
      { name: "fighting", damage: 1 },
      { name: "fire", damage: 1 },
      { name: "flying", damage: 1 },
      { name: "ghost", damage: 1 },
      { name: "grass", damage: 1 },
      { name: "ground", damage: 1 },
      { name: "ice", damage: 1 },
      { name: "normal", damage: 1 },
      { name: "poison", damage: 1 },
      { name: "psychic", damage: 1 },
      { name: "rock", damage: 1 },
      { name: "steel", damage: 1 },
      { name: "water", damage: 1 }
    ];

    this.state = {
      loading: true,
      id,
      imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
      colors,
      map,
      allTypes
    };

    this.handlePokemon = this.handlePokemon.bind(this);
    this.redirect = this.redirect.bind(this);
    this.setPokeInfo = this.setPokeInfo.bind(this);
  }
  componentDidMount() {
    this.setPokeInfo(this.state.id);
  }
  componentDidUpdate(prevProps) {
    const { pathname } = this.props.location;
    const { pathname: prevPathname } = prevProps.location;
    if (pathname && pathname !== prevPathname) {
      const id = isNaN(this.props.id)
        ? this.state.map[this.props.id]
        : this.props.id;
      this.handlePokemon(id);
      return true;
    }
  }
  setPokeInfo = id => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
      .then(res => res.json())
      .then(response => {
        let name = response.name;
        let types = response.types;
        const allTypes = this.state.allTypes;
        // calculate type advantages
        types.forEach(type => {
          allTypes.forEach(currentType => {
            currentType.damage *= this.typeMaps[type.type.name][
              currentType.name
            ];
          });
        });
        allTypes.sort((a, b) => {
          return b.damage - a.damage;
        });

        this.setState({
          name,
          types,
          loading: false,
          allTypes
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
              let index = response.chain.species.url.split("/");
              chainId = index[index.length - 2];
              chain.push({
                name: response.chain.species.name,
                url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${chainId}.png`,
                pokeId: chainId
              });
              if (chains[1]) {
                chains.forEach(currentChain => {
                  index = currentChain.species.url.split("/");
                  chainId = index[index.length - 2];
                  chain.push({
                    name: currentChain.species.name,
                    url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${chainId}.png`,
                    pokeId: chainId
                  });
                  chains = [];
                });
              }
              while (chains[0] && chains[0].evolves_to) {
                index = chains[0].species.url.split("/");
                chainId = index[index.length - 2];
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
    this.setState({
      id,
      imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
    });
    this.setPokeInfo(id);
  };
  redirect = id => {
    return () => {
      navigate(`${id}`);
      this.handlePokemon(id);
    };
  };
  render() {
    const { classes } = this.props;
    const { colors, allTypes } = this.state;
    if (this.state.loading) {
      return <PokeEntrySkeleton classes={classes} allTypes={allTypes} />;
    }
    const { name, imageUrl, id, types, description } = this.state;
    return (
      <div className="pokedex-container" style={{ padding: 15 }}>
        <Card className={classes.card} id={id}>
          <Link to="/">
            <IconButton aria-label="back" className={classes.link}>
              <ArrowBackIcon />
            </IconButton>
          </Link>
          <CardContent className={classes.cardContent}>
            <CardMedia
              className={classes.img}
              component="img"
              image={imageUrl}
              alt={name}
            />
            <div
              style={{
                flex: "1",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center"
              }}
            >
              <Typography gutterBottom variant="h5" component="h2">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {description}
              </Typography>
              <section>
                {types.map((type, index) => {
                  const color = colors[type.type.name];
                  return (
                    <Chip
                      key={index}
                      className={classes.type}
                      style={{
                        backgroundColor: color
                      }}
                      label={type.type.name}
                    />
                  );
                })}
              </section>
              <h2>Evolutions: </h2>
              <Breadcrumbs separator="" maxItems={10} aria-label="breadcrumb">
                {this.state.chain
                  ? this.state.chain.map((evolution, index) => {
                      return (
                        <div
                          key={index}
                          role="link"
                          onClick={this.redirect(evolution.pokeId)}
                          className={classes.breadcrumbs}
                        >
                          <img src={evolution.url} alt={evolution.name} />
                          {evolution.name}
                        </div>
                      );
                    })
                  : ""}
              </Breadcrumbs>
            </div>
            <div
              className="types"
              style={{
                width: "100%"
              }}
            >
              <h3>Damage when attacked</h3>
              <div
                className="typesContainer"
                style={{
                  width: "100%",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gridTemplateRows: "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr",
                  gridAutoFlow: "column"
                }}
              >
                {allTypes.map(type => {
                  return (
                    <div
                      key={type.name}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        minWidth: "40%"
                      }}
                    >
                      <Chip
                        className={classes.type}
                        style={{
                          backgroundColor: colors[type.name]
                        }}
                        label={type.name}
                      />
                      <span style={{ width: "1rem", paddingTop: 10 }}>
                        {type.damage}x
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}

const PokeEntrySkeleton = props => {
  const classes = props.classes;
  const allTypes = props.allTypes;
  return (
    <div className="pokedex-container" style={{ padding: 15 }}>
      <Card className={classes.card}>
        <Link to="/">
          <IconButton aria-label="back" className={classes.link}>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        <CardActionArea>
          <CardContent className={classes.cardContent}>
            <Skeleton
              variant="rect"
              className={(classes.img, classes.skeletonImg)}
              style={{ marginRight: "1rem", marginBottom: "1rem" }}
            />
            <div
              style={{
                flex: "1",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center"
              }}
            >
              <Skeleton variant="rect" width="30%" />
              <br />
              <Skeleton variant="rect" width="100%" />
              <br />
              <Skeleton variant="rect" width="80%" />
              <br />
              <div style={{ display: "flex", marginBottom: "1rem" }}>
                <Skeleton
                  style={{ marginRight: "0.5rem" }}
                  variant="rect"
                  width="8rem"
                  height={30}
                />
                <Skeleton
                  style={{ marginRight: "0.5rem" }}
                  variant="rect"
                  width="8rem"
                  height={30}
                />
              </div>
              <div style={{ display: "flex" }}>
                <Skeleton
                  style={{ marginRight: "1rem" }}
                  variant="circle"
                  width={40}
                  height={40}
                />
                <Skeleton
                  style={{ marginRight: "1rem" }}
                  variant="circle"
                  width={40}
                  height={40}
                />
                <Skeleton
                  style={{ marginRight: "1rem" }}
                  variant="circle"
                  width={40}
                  height={40}
                />
              </div>
            </div>
            <div
              className="types"
              style={{
                width: "100%"
              }}
            >
              <h3>Damage when attacked</h3>
              <div
                className="typesContainer"
                style={{
                  width: "100%",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gridTemplateRows: "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr",
                  gridAutoFlow: "column"
                }}
              >
                {allTypes.map(type => {
                  return (
                    <div
                      key={type.name}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        minWidth: "40%"
                      }}
                    >
                      <Chip className={classes.type} label={type.name} />
                      <span style={{ width: "1rem", paddingTop: 10 }}>--</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
};

export default withStyles(styles)(Pokeentry);
