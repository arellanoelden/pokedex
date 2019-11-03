import React from "react";
import { Link } from "@reach/router";
import evolutionChains from "./evolutionChains";

class Pokeentry extends React.Component {
  state = {
    loading: true,
    imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
      this.props.id
    }.png`,
    id: this.props.id
  };
  componentDidMount() {
    fetch(`https://pokeapi.co/api/v2/pokemon/${this.state.id}/`)
      .then(res => res.json())
      .then(response => {
        let name = response.name;
        let types = response.types;
        this.setState({
          name,
          types,
          loading: false
        });
      })
      .catch(error => console.error("Error:", error));

    fetch(`https://pokeapi.co/api/v2/type/${this.state.id}`)
      .then(res => res.json())
      .then(response => {
        console.log(response);
        debugger;
      });
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${this.state.id}`)
      .then(res => res.json())
      .then(response => {
        console.log(response);
        this.setState({
          description: response.flavor_text_entries[1].flavor_text
        });

        fetch(response.evolution_chain.url)
          .then(res => res.json())
          .then(response => {
            let chain = [];
            let chains = response.chain.evolves_to;
            let chainId = 0;
            if (chains) {
              chainId = response.chain.species.url.charAt(
                response.chain.species.url.length - 2
              );
              chain.push({
                name: response.chain.species.name,
                url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${chainId}.png`
              });
              while (chains[0] && chains[0].evolves_to) {
                chainId++;
                chain.push({
                  name: chains[0].species.name,
                  url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${chainId}.png`
                });
                chains = chains[0].evolves_to;
              }
              this.setState({
                chain
              });
            }
          })
          .catch(error => console.error("Error:", error));
      });
  }
  render() {
    if (this.state.loading) return <h1>loading ... </h1>;
    const { name, imageUrl, id, types, description } = this.state;
    return (
      <div className="pokemon" id={id}>
        {id}
        <Link to={`/#${id}`}>Back</Link>
        <img src={imageUrl} alt={name} />
        <p>{name}</p>
        <p>{description}</p>
        <ol className="types">
          {types.map((type, index) => {
            return <li key={index}>{type.type.name}</li>;
          })}
        </ol>
        <ul className="evolutions">
          {this.state.chain
            ? this.state.chain.map((evolution, index) => {
                return (
                  <li key={index}>
                    {evolution.name}
                    <img src={evolution.url} alt={evolution.name} />
                  </li>
                );
              })
            : ""}
        </ul>
      </div>
    );
  }
}

export default Pokeentry;
