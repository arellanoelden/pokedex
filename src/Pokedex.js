import React from "react";
import Pokemon from "./Pokemon";
import Grid from "@material-ui/core/Grid";

class Pokedex extends React.Component {
  state = {
    ids: [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20
    ],
    loading: true
  };
  componentDidMount() {}
  render() {
    const { ids } = this.state;
    return (
      <div className="pokedex-container" style={{ padding: 15 }}>
        <Grid container spacing={3} className="pokedex">
          {ids.map(id => {
            return (
              /* eslint-disable-next-line */
              <Grid item xs={12} sm={6} md={3}>
                <Pokemon id={id} key={id} />
              </Grid>
            );
          })}
        </Grid>
      </div>
    );
  }
}

export default Pokedex;
