import React from "react";
import Tile from "./Tile";

const Row = ({ guess, isCurrent, currentGuess, targetWord, showFeedback }) => {
  const letters = isCurrent ? currentGuess.padEnd(5, " ") : guess;

  return (
    <div className="row">
      {Array.from({ length: 5 }).map((_, index) => (
        <Tile
          key={index}
          letter={letters[index]}
          isCorrect={showFeedback && letters[index] === targetWord[index]}
          isPresent={showFeedback && targetWord.includes(letters[index])}
        />
      ))}
    </div>
  );
};

export default Row;