import React from "react";
import Pokemon from "./Pokemon";
import Grid from "@material-ui/core/Grid";
import LazyLoad from "react-lazyload";

class Pokedex extends React.Component {
  constructor(props) {
    super(props);
    const ids = require("./Pokemap").pokeIds();
    this.state = {
      ids,
      loading: true,
      once: true
    };
  }
  callback() {}
  render() {
    const { ids, once } = this.state;
    return (
      <div className="pokedex-container" style={{ padding: 15 }}>
        <Grid container spacing={3} className="pokedex">
          {ids.map(id => {
            return (
              /* eslint-disable-next-line */
              <Grid key={id} item xs={12} sm={6} md={3}>
                <LazyLoad once={once} height={200} offset={[-100, 0]}>
                  <Pokemon id={id} />
                </LazyLoad>
              </Grid>
            );
          })}
        </Grid>
      </div>
    );
  }
}

export default Pokedex;
