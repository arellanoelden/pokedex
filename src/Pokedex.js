import React from "react";
import Pokemon from "./Pokemon";
import Grid from "@material-ui/core/Grid";
import LazyLoad from "react-lazyload";
import Pokeentry from "./Pokeentry";
import Navbar from "./NavBar";

class Pokedex extends React.Component {
  constructor(props) {
    super(props);
    const ids = require("./Pokemap").pokeIds();
    this.state = {
      currentId: -1,
      ids,
      loading: true,
      once: true
    };
    this.setCurrentId = this.setCurrentId.bind(this);
    this.setIds = this.setIds.bind(this);
  }
  callback() {}
  setCurrentId(currentId) {
    this.setState({ currentId });
  }
  setIds(ids) {
    this.setState({ ids });
  }
  render() {
    const { currentId, ids, once } = this.state;
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
                /* eslint-disable-next-line */
                <Grid key={id} item xs={4} sm={6} md={4}>
                  <LazyLoad once={once} height={200} offset={[1000, 0]}>
                    <Pokemon id={id} setCurrentId={this.setCurrentId} />
                  </LazyLoad>
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
