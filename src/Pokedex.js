import React from "react";
import Pokemon from "./Pokemon";

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
      <div className="pokedex">
        {ids.map(id => {
          return (
            /* eslint-disable-next-line */
            <Pokemon id={id} key={id} />
          );
        })}
      </div>
    );
  }
}

export default Pokedex;
