import React from "react";

const Tile = ({ letter, state }) => {
  let className = "tile";
  if (letter !== " ") {
    className += " filled";
  }
  if (state) {
    className += ` ${state}`;
  }

  return <div className={className}>{letter}</div>;
};

export default Tile;