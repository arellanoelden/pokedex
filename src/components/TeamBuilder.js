import React, { useState, useEffect, useContext, useRef } from "react";
import Chip from "@material-ui/core/Chip";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Button from "@material-ui/core/Button";
import {
  Card,
  CardActionArea,
  CardContent,
  CardActions
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Clear from "@material-ui/icons/Clear";
import { UserContext } from "../providers/UserProvider";
import { firestore } from "../firebase";
import { navigate } from "@reach/router";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

const styles = theme => ({
  header: {
    textAlign: "center",
    fontSize: "1rem"
  },
  card: {
    backgroundColor: theme.palette.secondary.main,
    color: "white"
  },
  type: {
    borderRadius: "0",
    color: "#FFF",
    width: "10rem",
    marginRight: "1rem",
    [theme.breakpoints.down("sm")]: {
      width: "7.5rem"
    }
  }
});

const TeamBuilder = props => {
  const currentUser = useContext(UserContext);
  let uid;
  if (currentUser && currentUser.uid) {
    uid = currentUser.uid;
  }
  const maps = require("../Pokemap.js");
  const typeMaps = maps.typeAdvantages();
  const colors = maps.typeColor();
  const pokeMap = maps.objectMap();
  const pokeNames = maps.pokeNames();
  const [weakAgainst, setWeakAgainst] = useState([]);
  const [pokeArray, setPokeArray] = useState([]);
  const [error, setError] = useState("");
  const teamCount = useRef(0);
  const [snackOpen, setSnackOpen] = useState(false);
  const [teamName, setTeamName] = useState(props.id ? props.id : "");

  useEffect(
    () => {
      if (props.id) {
        firestore
          .collection(`users/${uid}/teams`)
          .doc(props.id)
          .get()
          .then(doc => {
            const data = doc.data();
            if (data && data.pokeArray) setPokeArray(doc.data().pokeArray);
          });
      }
    },
    [props.id, uid]
  );
  useEffect(
    () => {
      async function calculateTypeDisadvantages() {
        const pokemonTeam = [];
        for (let poke of pokeArray) {
          const x = await (await fetch(
            `https://pokeapi.co/api/v2/pokemon/${poke}/`
          )).json();
          pokemonTeam.push(x);
        }
        const weakAgainstTemp = {};
        for (let pokemon of pokemonTeam) {
          const pokemonTypes = pokemon.types;
          const baseTypes = [
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

          for (let type of pokemonTypes) {
            let typeValue = type.type.name;
            baseTypes.forEach(currentType => {
              currentType.damage *= typeMaps[typeValue][currentType.name];
            });
          }

          const weakAgainstTypes = baseTypes.filter(type => type.damage >= 2);
          for (let weakAgainstType of weakAgainstTypes) {
            if (!weakAgainstTemp[weakAgainstType.name]) {
              weakAgainstTemp[weakAgainstType.name] = 1;
            } else {
              weakAgainstTemp[weakAgainstType.name]++;
            }
          }
        }
        setWeakAgainst(
          Object.entries(weakAgainstTemp).sort((a, b) => b[1] - a[1])
        );
      }
      if (pokeArray.length > 0) {
        calculateTypeDisadvantages();
      } else {
        setWeakAgainst([]);
      }
    },
    [pokeArray]
  );

  useEffect(
    () => {
      async function getTeamCount() {
        const doc = await firestore
          .collection("users")
          .doc(uid)
          .get();
        teamCount.current = doc.data().teamCount;
        if (teamName === "") setTeamName(`team${teamCount.current}`);
      }
      if (uid && !teamCount.current) {
        getTeamCount();
      }
    },
    [uid, teamCount]
  );

  function clearTeam() {
    setPokeArray([]);
  }
  async function saveTeam() {
    await firestore
      .collection(`users/${uid}/teams`)
      .doc(teamName)
      .set({
        pokeArray
      });
    setSnackOpen(true);
    if (props.id && teamName !== props.id) {
      firestore
        .collection(`users/${uid}/teams`)
        .doc(props.id)
        .delete();
    }
    setTimeout(() => {
      navigate("/teams");
    }, 1000);
    firestore
      .collection("users")
      .doc(uid)
      .update({
        teamCount: teamCount.current + 1
      });
  }
  function deletePokemonFromTeam(id) {
    setPokeArray(pokeArray.filter(currentId => currentId !== id));
  }
  function select(e) {
    if (pokeArray.length < 6) {
      const pokeName = e.target.textContent;
      if (pokeName !== "") {
        setPokeArray([...pokeArray, pokeMap[pokeName]]);
      }
    } else {
      setError(
        "Your party is full. Please delete one member from your team if you wish to add this pokemon to your team"
      );
    }
  }

  const { classes } = props;
  return (
    <Card
      className="teamCardContainer"
      style={{ margin: "1rem", padding: "2rem 1rem" }}
    >
      {uid && (
        <Button
          variant="contained"
          color="secondary"
          style={{ height: "80%", marginBottom: "1rem", color: "white" }}
          onClick={() => navigate("/teams")}
        >
          Back to Teams
        </Button>
      )}
      <h1>
        {props.id || uid ? (
          <TextField
            label="Team Name"
            color="secondary"
            variant="outlined"
            style={{ minWidth: 200 }}
            value={teamName}
            onChange={e => setTeamName(e.target.value)}
          />
        ) : (
          "Current Team"
        )}
      </h1>
      {error && <p>{error}</p>}
      <div style={{ display: "flex", margin: "1rem 0", alignItems: "center" }}>
        <Autocomplete
          id="combo-box-demo"
          options={pokeNames}
          onInputChange={select}
          renderInput={params => (
            <TextField
              {...params}
              label="Search"
              color="secondary"
              variant="outlined"
              style={{ minWidth: 200 }}
            />
          )}
          renderOption={option => <p style={{ width: "100%" }}>{option}</p>}
        />
        <Button
          variant="contained"
          color="secondary"
          style={{ height: "80%", marginLeft: "1rem", color: "white" }}
          onClick={() => clearTeam()}
        >
          Clear
        </Button>
        {currentUser && (
          <Button
            variant="contained"
            color="secondary"
            style={{ height: "80%", marginLeft: "0.5rem", color: "white" }}
            onClick={() => saveTeam()}
          >
            Save
          </Button>
        )}
      </div>
      <div>
        <Grid container spacing={3}>
          {pokeArray.map((pokemonId, index) => (
            <Grid key={`pokemon${pokemonId}-${index}`} item xs={4} md={2}>
              <Card className={classes.card}>
                <CardActions
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => deletePokemonFromTeam(pokemonId)}
                  >
                    <Clear />
                  </IconButton>
                </CardActions>
                <CardActionArea>
                  <div className={`sprite sprite-${pokemonId}`} />
                  <CardContent style={{ padding: 0 }}>
                    <Typography
                      gutterBottom
                      component="h2"
                      className={classes.header}
                    >
                      {pokeMap[pokemonId]
                        ? pokeMap[pokemonId].charAt(0).toUpperCase() +
                          pokeMap[pokemonId].slice(1)
                        : ""}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
      {weakAgainst.length > 0 && (
        <section>
          <h2 style={{ margin: "1rem 0" }}>Team Type Disadvantages: </h2>
          <Grid container spacing={3}>
            {weakAgainst.map(type => (
              <Grid key={type[0]} item xs={6} md={4}>
                <Chip
                  className={classes.type}
                  style={{
                    backgroundColor: colors[type[0]]
                  }}
                  label={type[0]}
                />
                {type[1]}
              </Grid>
            ))}
          </Grid>
        </section>
      )}
      <Snackbar
        open={snackOpen}
        autoHideDuration={6000}
        onClose={() => setSnackOpen(false)}
      >
        <MuiAlert
          onClose={() => setSnackOpen(false)}
          severity="success"
          elevation={6}
          variant="filled"
        >
          Team Saved!
        </MuiAlert>
      </Snackbar>
    </Card>
  );
};

export default withStyles(styles)(TeamBuilder);
