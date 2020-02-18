import React, { useContext, useEffect, useState } from "react";
import { navigate } from "@reach/router";
import { firestore } from "../firebase";
import { UserContext } from "../providers/UserProvider";
import { Card, CardActions } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Delete from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";

const styles = theme => ({
  header: {
    textAlign: "center",
    fontSize: "1rem"
  },
  card: {
    padding: "1rem",
    marginBottom: "1rem",
    backgroundColor: theme.palette.secondary.main,
    color: "white"
  }
});

const Teams = props => {
  const currentUser = useContext(UserContext);
  const [teams, setTeams] = useState([]);
  const maps = require("../Pokemap.js");
  const pokeMap = maps.objectMap();
  let uid;
  if (currentUser && currentUser.uid) {
    uid = currentUser.uid;
  }
  useEffect(
    () => {
      if (uid) {
        firestore
          .collection(`users/${uid}/teams`)
          .get()
          .then(snapshot => {
            const newTeams = [];
            snapshot.forEach(team => {
              newTeams.push({ id: team.id, pokeArray: team.data().pokeArray });
            });
            setTeams(newTeams);
          });
      }
    },
    [uid]
  );

  function deleteTeam(teamId) {
    firestore
      .collection(`users/${uid}/teams`)
      .doc(teamId)
      .delete()
      .then(() => {
        setTeams(teams.filter(team => team.id !== teamId));
      });
  }

  function editTeam(teamId) {
    navigate(`/teamBuilder/${teamId}`);
  }

  const { classes } = props;

  return (
    <Card
      className="teamCardContainer"
      style={{ margin: "1rem", padding: "2rem 1rem" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Teams:</h1>
        <Button
          variant="contained"
          color="secondary"
          style={{ color: "white" }}
          onClick={() => navigate("/teamBuilder")}
        >
          Create New Team
        </Button>
      </div>
      <section className="teamsList" style={{ margin: "1rem 0" }}>
        {teams &&
          teams.map(team => (
            <Card key={team.id} className={classes.card}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <h2>{team.id}</h2>
                <CardActions
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => editTeam(team.id)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => deleteTeam(team.id)}
                  >
                    <Delete />
                  </IconButton>
                </CardActions>
              </div>
              <Grid container spacing={3}>
                {team.pokeArray.length > 0 &&
                  team.pokeArray.map(pokemonId => (
                    <Grid key={`${team.id}-${pokemonId}`} item xs={4} sm={2}>
                      <div className={`sprite sprite-${pokemonId}`} />
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
                    </Grid>
                  ))}
              </Grid>
            </Card>
          ))}
      </section>
    </Card>
  );
};

export default withStyles(styles)(Teams);
