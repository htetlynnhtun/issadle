import React, { useState, useCallback, useEffect } from "react";
import Grid from "./Grid";

const API_URL = 'http://localhost:5000/api';

const App = () => {
  const [guesses, setGuesses] = useState(["", "", "", "", "", ""]);
  const [evaluations, setEvaluations] = useState(Array(6).fill(null));
  const [currentGuess, setCurrentGuess] = useState("");
  const [currentRow, setCurrentRow] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");

  const startNewGame = async () => {
    try {
      const response = await fetch(`${API_URL}/new-game`, {
        method: 'POST'
      });
      const data = await response.json();
      setGuesses(data.guesses);
      setCurrentRow(data.currentRow);
      setGameOver(false);
      setMessage("");
    } catch (error) {
      console.error('Error starting new game:', error);
    }
  };

  useEffect(() => {
    startNewGame();
  }, []);

  const makeGuess = async (guess) => {
    try {
      const response = await fetch(`${API_URL}/make-guess`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ guess }),
      });
      const data = await response.json();
      
      setGuesses(data.guesses);
      setCurrentRow(data.currentRow);
      
      // Update evaluations with the new evaluation
      const newEvaluations = [...evaluations];
      newEvaluations[currentRow] = data.evaluation;
      setEvaluations(newEvaluations);
      
      if (data.gameOver) {
        setGameOver(true);
        setMessage(data.isCorrect ? "Congratulations!" : `Game Over! The word was ${data.targetWord}`);
      }
    } catch (error) {
      console.error('Error making guess:', error);
    }
  };

  const handleInput = useCallback(
    (e) => {
      console.log("handleInput");
      if (gameOver) return;

      if (e.key === "Enter") {
        if (currentGuess.length === 5) {
          console.log("about to make guess");
          makeGuess(currentGuess);
          setCurrentGuess("");
        }
      } else if (e.key === "Backspace") {
        setCurrentGuess(currentGuess.slice(0, -1));
      } else if (/^[A-Za-z]$/.test(e.key) && currentGuess.length < 5) {
        setCurrentGuess(currentGuess + e.key.toUpperCase());
      }
    },
    [currentGuess, gameOver]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleInput);
    return () => window.removeEventListener("keydown", handleInput);
  }, [handleInput]);

  return (
    <div className="App">
      <h1>Issadle</h1>
      <Grid 
        guesses={guesses} 
        currentGuess={currentGuess} 
        currentRow={currentRow}
        evaluations={evaluations}
      />
      {message && <p className="message">{message}</p>}
      {gameOver && (
        <button onClick={startNewGame}>New Game</button>
      )}
    </div>
  );
};

export default App;