import React from "react";
import { PokeIdContext } from "../providers/pokeIdProvider";

const getDisplayName = WrappedComponent => {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
};

const withPokeIds = Component => {
  const WrappedComponent = props => {
    return (
      <PokeIdContext.Consumer>
        {value => (
          <Component ids={value.ids} setIds={value.setIds} {...props} />
        )}
      </PokeIdContext.Consumer>
    );
  };
  WrappedComponent.displayName = `WithUser(${getDisplayName(
    WrappedComponent
  )})`;
  return WrappedComponent;
};
export default withPokeIds;
