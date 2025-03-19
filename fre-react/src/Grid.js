import React from "react";
import Row from "./Row";

const Grid = ({ guesses, currentGuess, targetWord, currentRow }) => {
  return (
    <div className="grid">
      {guesses.map((guess, index) => (
        <Row
          key={index}
          guess={guess}
          isCurrent={index === currentRow}
          currentGuess={currentGuess}
          targetWord={targetWord}
          showFeedback={index < currentRow}
        />
      ))}
    </div>
  );
};

export default Grid;