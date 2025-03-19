import React from "react";

const Tile = ({ letter, isCorrect, isPresent }) => {
  let className = "tile";
  if (isCorrect) {
    className += " correct";
  } else if (isPresent) {
    className += " present";
  }

  return <div className={className}>{letter}</div>;
};

export default Tile;