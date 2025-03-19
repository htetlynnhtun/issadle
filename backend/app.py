from flask import Flask, jsonify, request
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

WORD_LIST = [
    "REACT", "TRACE", "CRATE", "CATER", "HEART",
    "ABOUT", "ABOVE", "AFTER", "AGAIN", "ALONE",
    "ALONG", "BEACH", "BEGIN", "BLACK", "BRING",
    "CHILD", "CLEAN", "CLEAR", "CLOSE", "COUNT",
    "DREAM", "DRINK", "DRIVE", "EARLY", "EARTH",
    "ENJOY", "ENTER", "EVERY", "FOCUS", "FORCE",
    "FRESH", "GREAT", "GREEN", "HAPPY", "HOUSE",
    "LEARN", "LIGHT", "MONEY", "MUSIC", "NEVER",
    "NIGHT", "PEACE", "PLACE", "PLANT", "POINT",
    "POWER", "PRICE", "QUICK", "RIGHT", "SMILE",
    "SOUND", "SPACE", "SPEAK", "STAND", "START",
    "STATE", "STORY", "STUDY", "STYLE", "SWEET",
    "TABLE", "THANK", "THINK", "TODAY", "TOUCH",
    "VOICE", "WATCH", "WATER", "WORLD", "WRITE",
    "YOUNG"
]

class GameState:
    def __init__(self):
        self.target_word = random.choice(WORD_LIST)
        self.guesses = [""] * 6
        self.current_row = 0

    def evaluate_guess(self, guess):
        result = ["absent"] * 5
        target_chars = list(self.target_word)
        
        # First pass: mark correct letters
        for i in range(5):
            if guess[i] == target_chars[i]:
                result[i] = "correct"
                target_chars[i] = None
        
        # Second pass: mark present letters
        for i in range(5):
            if result[i] != "correct" and guess[i] in target_chars:
                result[i] = "present"
                target_chars[target_chars.index(guess[i])] = None
                
        return result

game_state = GameState()

@app.route('/api/new-game', methods=['POST'])
def new_game():
    global game_state
    game_state = GameState()
    return jsonify({
        'guesses': game_state.guesses,
        'currentRow': game_state.current_row
    })

@app.route('/api/make-guess', methods=['POST'])
def make_guess():
    data = request.get_json()
    guess = data.get('guess', '').upper()
    
    if len(guess) != 5 or game_state.current_row >= 6:
        return jsonify({'error': 'Invalid guess'}), 400
    
    if guess not in WORD_LIST:
        return jsonify({'error': 'Word not found'}), 400

    evaluation = game_state.evaluate_guess(guess)
    game_state.guesses[game_state.current_row] = guess
    game_state.current_row += 1
    
    game_over = game_state.current_row >= 6 or guess == game_state.target_word
    
    return jsonify({
        'guesses': game_state.guesses,
        'currentRow': game_state.current_row,
        'evaluation': evaluation,
        'isCorrect': guess == game_state.target_word,
        'gameOver': game_over,
        'targetWord': game_state.target_word if game_over else None
    })

if __name__ == '__main__':
    app.run(debug=True)