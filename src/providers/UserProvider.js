import React, { Component, createContext } from "react";
import { auth, createUserProfileDocument } from "../firebase";
import withPokeIds from "../components/withPokeIds";
import { pokeIds } from "../Pokemap";

export const UserContext = createContext();

class UserProvider extends Component {
  state = {
    user: null
  };

  unsubscribeFromAuth = null;

  componentDidMount = async () => {
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);
        userRef.onSnapshot(snapshot => {
          this.setState({ user: { uid: snapshot.id, ...snapshot.data() } });
        });
      } else {
        this.props.setIds(pokeIds);
      }
      this.setState({ user: userAuth });
    });
  };

  componentWillUnmount = () => {
    this.unsubscribeFromAuth();
  };

  render() {
    const { user } = this.state;
    const { children } = this.props;
    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
  }
}

export default withPokeIds(UserProvider);
