import React, { Component, createContext } from "react";
import { pokeIds } from "../Pokemap";

export const PokeIdContext = createContext();

class pokeIdProvider extends Component {
  state = {
    ids: pokeIds
  };
  setIds = this.setIds.bind(this);

  setIds(ids) {
    this.setState({ ids });
  }

  render() {
    const { ids } = this.state;
    const { children } = this.props;
    const value = { ids, setIds: this.setIds };
    return (
      <PokeIdContext.Provider value={value}>{children}</PokeIdContext.Provider>
    );
  }
}

export default pokeIdProvider;
