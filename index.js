const crypto = require("crypto");

function generateKey() {
  return crypto.randomBytes(32); 
}

function Result(playerMove, computerMove, moves) {
  const half = Math.floor(moves.length / 2);
  if (playerMove === computerMove) {
    return "Draw";
  } else if (
    moves
      .slice(moves.indexOf(computerMove) + 1)
      .slice(0, half)
      .includes(playerMove)
  ) {
    return "You win!";
  } else {
    return "Computer wins";
  }
}

function Table(moves) {
  const table = [["", ...moves]];
  moves.forEach((move) => {
    const row = [move];
    moves.forEach((opponentMove) => {
      if (move === opponentMove) {
        row.push("Draw");
      } else if (
        moves
          .slice(moves.indexOf(move) + 1)
          .slice(0, moves.length / 2)
          .includes(opponentMove)
      ) {
        row.push("Win");
      } else {
        row.push("Lose");
      }
    });
    table.push(row);
  });
  return table;
}

function playGame(moves, readLine) {
  const key = generateKey();
  const computerMove = moves[Math.floor(Math.random() * moves.length)];
  const hmacDigest = crypto
    .createHmac("sha256", key)
    .update(computerMove)
    .digest("hex");

  console.log(`HMAC: ${hmacDigest}`);
  console.log("Available moves:");
  moves.forEach((move, index) => {
    console.log(`${index + 1} - ${move}`);
  });
  console.log("0 - exit");
  console.log("? - help");

  readLine.question("Enter your move: ", (userInput) => {
    if (userInput === "?") {
      displayHelpTable(moves);
      playGame(moves, readLine);
    } else if (userInput === "0") {
      console.log("Exiting the game.");
      readLine.close();
    } else if (
      !isNaN(userInput) &&
      userInput > 0 &&
      userInput <= moves.length
    ) {
      const userMove = moves[userInput - 1];
      console.log(`Your move: ${userMove}`);
      console.log(`Computer move: ${computerMove}`);
      const result = Result(userMove, computerMove, moves);
      console.log(result);
      console.log(`HMAC key: ${key.toString("hex")}`);
      readLine.question(
        "Press Enter to play again or type 'exit' to quit: ",
        (answer) => {
          if (answer.toLowerCase() === "exit") {
            console.log("Exiting the game.");
            readLine.close();
          } else {
            playGame(moves, readLine);
          }
        }
      );
    } else {
      console.log("Invalid input. Please try again.");
      playGame(moves, readLine);
    }
  });
}

function displayHelpTable(moves) {
  const table = Table(moves);
  console.log("Help table:");
  table.forEach((row) => {
    console.log(row.join(" | "));
  });
}

const readline = require("readline");
const readLine = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const moves = process.argv.slice(2);
if (moves.length < 3 || moves.length % 2 === 0) {
  console.log(
    "Incorrect number of arguments. Please provide an odd number of non-repeating strings."
  );
  console.log("Example: node index.js rock paper scissors");
  readLine.close();
} else {
  playGame(moves, readLine);
}
