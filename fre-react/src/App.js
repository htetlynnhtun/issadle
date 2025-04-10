import React, { useState, useCallback, useEffect } from "react";
import Grid from "./Grid";
import Keyboard from './Keyboard';
import Confetti from 'react-confetti';

const API_URL = 'http://localhost:5000/api';

const App = () => {
  const [guesses, setGuesses] = useState(["", "", "", "", "", ""]);
  const [evaluations, setEvaluations] = useState(Array(6).fill(null));
  const [currentGuess, setCurrentGuess] = useState("");
  const [currentRow, setCurrentRow] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [letterStates, setLetterStates] = useState({});
  const [error, setError] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  const startNewGame = async () => {
    try {
      const response = await fetch(`${API_URL}/new-game`, {
        method: 'POST'
      });
      const data = await response.json();
      setGuesses(data.guesses);
      setCurrentRow(data.currentRow);
      setCurrentGuess("");
      setEvaluations(Array(6).fill(null));
      setGameOver(false);
      setMessage("");
      setLetterStates({}); // Reset the keyboard letter states
    } catch (error) {
      console.error('Error starting new game:', error);
    }
  };

  useEffect(() => {
    startNewGame();
  }, []);

  // Update the makeGuess function
  const makeGuess = async (guess) => {
    try {
      const response = await fetch('http://localhost:5000/api/make-guess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ guess }),
      });
      const data = await response.json();
      
      if (data.won) {
        setShowConfetti(true);
        // Optional: Hide confetti after 5 seconds
        setTimeout(() => setShowConfetti(false), 5000);
      }
      
      if (!response.ok) {
        setError(data.error);
        setTimeout(() => setError(""), 2000); // Auto-dismiss after 2 seconds
        return;
      }
      
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

  // Update letterStates when receiving evaluation
  useEffect(() => {
    if (evaluations[currentRow - 1]) {
      const newLetterStates = { ...letterStates };
      const guess = guesses[currentRow - 1];
      evaluations[currentRow - 1].forEach((state, index) => {
        const letter = guess[index];
        if (state === 'correct') {
          newLetterStates[letter] = 'correct';
        } else if (state === 'present' && newLetterStates[letter] !== 'correct') {
          newLetterStates[letter] = 'present';
        } else if (!newLetterStates[letter]) {
          newLetterStates[letter] = 'absent';
        }
      });
      setLetterStates(newLetterStates);
    }
  }, [evaluations, currentRow, guesses, letterStates]);

  return (
    <div className="App">
      <h1>Issadle</h1>

      {error && <div className="error-message">{error}</div>}

      {showConfetti && <Confetti />}

      <Grid 
        guesses={guesses} 
        currentGuess={currentGuess} 
        currentRow={currentRow}
        evaluations={evaluations}
      />
      <Keyboard 
        onKeyPress={handleInput}
        letterStates={letterStates}
      />
      {message && <p className="message">{message}</p>}
      {gameOver && (
        <button className="new-game-button" onClick={startNewGame}>New Game</button>
      )}
    </div>
  );
};

export default App;