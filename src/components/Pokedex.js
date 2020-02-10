import React from "react";
import Pokemon from "./Pokemon";
import Grid from "@material-ui/core/Grid";
import Pokeentry from "./Pokeentry";
import Navbar from "./NavBar";
import { firestore } from "../firebase";
import { pokeIds } from "../Pokemap";

class Pokedex extends React.Component {
  constructor(props) {
    super(props);

    const nameMap = require("../Pokemap").objectMap();
    this.state = {
      currentId: -1,
      ids: pokeIds,
      loading: true,
      nameMap,
      favorites: {}
    };
    this.setCurrentId = this.setCurrentId.bind(this);
    this.setIds = this.setIds.bind(this);
  }
  componentDidMount = async () => {
    this.unsubscribe = firestore
      .collection("favorites")
      .onSnapshot(snapshot => {
        const favorites = {};
        snapshot.forEach(doc => {
          favorites[doc.data().id] = true;
        });
        this.setState({ favorites });
        this.setState({ loading: false });
      });
  };
  setCurrentId(currentId) {
    this.setState({ currentId });
  }
  setIds(ids) {
    this.setState({ ids });
  }
  render() {
    const { currentId, ids, favorites, loading, nameMap } = this.state;
    return (
      <React.Fragment>
        <Navbar setIds={this.setIds} />
        <div className="pokedex-container" style={{ padding: 15 }}>
          <div className="sprite-1" />
          <Grid
            container
            spacing={3}
            className={currentId > 0 ? "activeId pokedex" : "pokedex"}
          >
            {ids.map(id => {
              return (
                <Grid key={id} item xs={4} sm={3} md={3}>
                  <Pokemon
                    id={id}
                    setCurrentId={this.setCurrentId}
                    favorite={favorites[id]}
                    name={nameMap[id]}
                    loading={loading}
                  />
                </Grid>
              );
            })}
          </Grid>
          <section
            className="currentPokemon"
            style={{ display: currentId > 0 ? "block" : "none" }}
          >
            <Pokeentry id={currentId} setCurrentId={this.setCurrentId} />
          </section>
        </div>
      </React.Fragment>
    );
  }
}

export default Pokedex;
