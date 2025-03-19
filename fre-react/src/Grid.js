import React from "react";
import Row from "./Row";

const Grid = ({ guesses, currentGuess, currentRow, evaluations }) => {
  return (
    <div className="grid">
      {guesses.map((guess, index) => (
        <Row
          key={index}
          guess={guess}
          isCurrent={index === currentRow}
          currentGuess={currentGuess}
          evaluation={evaluations[index]}
        />
      ))}
    </div>
  );
};

export default Grid;