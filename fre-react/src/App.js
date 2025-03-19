import React, { useState, useCallback } from "react";
import Grid from "./Grid";

const WORD_LIST = ["REACT", "TRACE", "CRATE", "CATER", "HEART"];

const App = () => {
  const [guesses, setGuesses] = useState(["", "", "", "", "", ""]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [currentRow, setCurrentRow] = useState(0);
  const [targetWord] = useState(() => {
    const randomIndex = Math.floor(Math.random() * WORD_LIST.length);
    return WORD_LIST[randomIndex];
  });

  const handleInput = useCallback(
    (e) => {
      if (e.key === "Enter") {
        if (currentGuess.length === 5) {
          const newGuesses = [...guesses];
          newGuesses[currentRow] = currentGuess;
          setGuesses(newGuesses);
          setCurrentGuess("");
          setCurrentRow(currentRow + 1);
        }
      } else if (e.key === "Backspace") {
        setCurrentGuess(currentGuess.slice(0, -1));
      } else if (/^[A-Za-z]$/.test(e.key) && currentGuess.length < 5) {
        setCurrentGuess(currentGuess + e.key.toUpperCase());
      }
    },
    [currentGuess, guesses, currentRow]
  );

  React.useEffect(() => {
    window.addEventListener("keydown", handleInput);
    return () => window.removeEventListener("keydown", handleInput);
  }, [handleInput]);

  return (
    <div className="App">
      <h1>Issadle</h1>
      <Grid 
        guesses={guesses} 
        currentGuess={currentGuess} 
        targetWord={targetWord}
        currentRow={currentRow}
      />
    </div>
  );
};

export default App;