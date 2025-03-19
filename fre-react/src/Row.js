import React from "react";
import Tile from "./Tile";

const Row = ({ guess, isCurrent, currentGuess, evaluation }) => {
  const letters = isCurrent ? currentGuess.padEnd(5, " ") : guess;

  return (
    <div className="row">
      {Array.from({ length: 5 }).map((_, index) => (
        <Tile
          key={index}
          letter={letters[index]}
          state={evaluation ? evaluation[index] : null}
        />
      ))}
    </div>
  );
};

export default Row;