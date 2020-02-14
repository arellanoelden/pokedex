import React, { useState, useEffect, useContext } from "react";
import Pokemon from "./Pokemon";
import Grid from "@material-ui/core/Grid";
import Pokeentry from "./Pokeentry";
import { firestore } from "../firebase";
import withPokeIds from "./withPokeIds";
import withUser from "./withUser";
import { UserContext } from "../providers/UserProvider";

const Pokedex = ({ ids }) => {
  const currentUser = useContext(UserContext);
  const nameMap = require("../Pokemap").objectMap();
  const [currentId, setCurrentId] = useState(-1);
  const [favorites, setFavorites] = useState({});
  const loading = false;

  useEffect(
    () => {
      let unsubscribe = () => {};
      if (currentUser) {
        const { uid } = currentUser;
        unsubscribe = firestore
          .collection(`users/${uid}/favorites`)
          .onSnapshot(snapshot => {
            const currFavorites = {};
            snapshot.forEach(doc => {
              currFavorites[doc.data().id] = true;
            });
            setFavorites(currFavorites);
          });
      }
      return () => {
        unsubscribe();
      };
    },
    [currentUser]
  );

  return (
    <div className="pokedex-container">
      <section className={`currentPokemon ${currentId > 0 ? "active" : ""}`}>
        <Pokeentry id={currentId} setCurrentId={setCurrentId} />
      </section>
      <Grid
        container
        spacing={3}
        className={currentId > 0 ? "activeId pokedex" : "pokedex"}
      >
        {ids.map(id => {
          return (
            <Grid key={id} item xs={4} sm={3} md={currentId > 0 ? 3 : 3}>
              <Pokemon
                id={id}
                setCurrentId={setCurrentId}
                favorite={favorites[id]}
                name={nameMap[id]}
                loading={loading}
              />
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

const MemoizedPokedex = React.memo(Pokedex);
export default withUser(withPokeIds(MemoizedPokedex));
