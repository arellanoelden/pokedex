import React from "react";
import { Link } from "@reach/router";

class Pokedex extends React.Component {
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
        console.log(response);
        let name = response.forms[0].name;
        let image = response.sprites.front_default;
        console.log(image);
        console.log(name);
        this.setState({
          name,
          loading: false
        });
      })
      .catch(error => console.error("Error:", error));
  }
  render() {
    if (this.state.loading) return <h1>loading ... </h1>;
    const { name, id, imageUrl } = this.state;
    return (
      <div className="pokemon" id={id}>
        {id}
        <Link to={`/${id}`}>View</Link>
        <img src={imageUrl} alt={name} />
        {name}
      </div>
    );
  }
}

export default Pokedex;
