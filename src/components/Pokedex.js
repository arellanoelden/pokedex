import React from "react";
import Pokemon from "./Pokemon";
import Grid from "@material-ui/core/Grid";
import Pokeentry from "./Pokeentry";
import { firestore } from "../firebase";
import withPokeIds from "./withPokeIds";
import withUser from "./withUser";

class Pokedex extends React.Component {
  constructor(props) {
    super(props);

    const nameMap = require("../Pokemap").objectMap();
    this.state = {
      currentId: -1,
      nameMap,
      favorites: {}
    };
    this.setCurrentId = this.setCurrentId.bind(this);
  }
  async componentDidMount() {
    if (this.props.user) {
      const { uid } = this.props.user;
      this.unsubscribe = firestore
        .collection(`users/${uid}/favorites`)
        .onSnapshot(snapshot => {
          const favorites = {};
          snapshot.forEach(doc => {
            favorites[doc.data().id] = true;
          });
          this.setState({ favorites });
        });
    }
  }
  async componentWillUnmount() {
    if (this.props.user) {
      this.unsubscribe();
    }
  }
  async componentDidUpdate(prevProps) {
    if (this.props.user && !prevProps.user) {
      const { uid } = this.props.user;
      this.unsubscribe = firestore
        .collection(`users/${uid}/favorites`)
        .onSnapshot(snapshot => {
          const favorites = {};
          snapshot.forEach(doc => {
            favorites[doc.data().id] = true;
          });
          this.setState({ favorites });
        });
    }
  }
  setCurrentId(currentId) {
    this.setState({ currentId });
  }
  render() {
    const { currentId, favorites, loading, nameMap } = this.state;
    const { ids } = this.props;
    return (
      <React.Fragment>
        <div className="pokedex-container" style={{ padding: 15 }}>
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

export default withUser(withPokeIds(Pokedex));
