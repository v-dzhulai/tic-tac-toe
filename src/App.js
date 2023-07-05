import React from 'react';
import { useState } from 'react';

function Square({ value, onSquareClick, classNames }) {
  return (
    <button className={`${classNames[0]} ${classNames[1]}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  const draw = calculateDraw(squares);
  const status = winner
    ? `Winner: ${winner[0]}`
    : draw
    ? 'Draw!'
    : `Next player: ${xIsNext ? 'X' : 'O'}`;

  function BoardRow({ numbers }) {
    return (
      <div className="board-row">
        {numbers.map((x, y) => {
          return (
            <Square
              classNames={['square', `${winner && winner[y] === squares[x] ? 'winnerSquare' : ''}`]}
              key={Math.random()}
              value={squares[x]}
              onSquareClick={() => handleClick(x)}
            />
          );
        })}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>

      <BoardRow numbers={[0, 1, 2]} />
      <BoardRow numbers={[3, 4, 5]} />
      <BoardRow numbers={[6, 7, 8]} />
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [reverse, setReverse] = useState(false);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    const description = move > 0 ? `Go to move #${move}` : 'Go to game start';

    return (
      <li key={move}>
        {/* <button onClick={() => jumpTo(move)}>{description}</button> */}
        <h1>You are at move #{move}</h1>
      </li>
    );
  });

  function reverseHistory() {
    setReverse(!reverse);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>

      <div className="game-info">
        <button onClick={reverseHistory}>Reverse</button>
        <ul>{!reverse ? moves : moves.reverse()}</ul>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], squares[b], squares[c]];
    }
  }

  return null;
}

function calculateDraw(squares) {
  for (let i = 0; i < squares.length; i++) {
    if (!squares[i]) return false;
  }

  return true;
}
