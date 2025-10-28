import React, { useEffect, useState, useRef } from "react";

const BOARD_SIZE = 10;
const STARTING_SNAKE = [
  [5, 5],
  [5, 4],
];
const INITIAL_DIRECTION = [0, 1]; 

function randomFood(snake) {
  let newFood;
  do {
    newFood = [
      Math.floor(Math.random() * BOARD_SIZE),
      Math.floor(Math.random() * BOARD_SIZE),
    ];
  } while (snake.some(([x, y]) => x === newFood[0] && y === newFood[1]));
  return newFood;
}

export default function SnakeGame() {
  const [snake, setSnake] = useState(STARTING_SNAKE);
  const [food, setFood] = useState(randomFood(STARTING_SNAKE));
  const [dir, setDir] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const moving = useRef(false);

  useEffect(() => {
    const keyHandler = (e) => {
      if (moving.current) return;
      moving.current = true;
      switch (e.key) {
        case "ArrowUp": if (dir[0] !== 1) setDir([-1, 0]); break;
        case "ArrowDown": if (dir[0] !== -1) setDir([1, 0]); break;
        case "ArrowLeft": if (dir[1] !== 1) setDir([0, -1]); break;
        case "ArrowRight": if (dir[1] !== -1) setDir([0, 1]); break;
        default: break;
      }
    };
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, [dir]);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setSnake((prev) => {
        let newHead = [
          (prev[0][0] + dir[0] + BOARD_SIZE) % BOARD_SIZE,
          (prev[0][1] + dir[1] + BOARD_SIZE) % BOARD_SIZE,
        ];
        if (prev.some(([x, y]) => x === newHead[0] && y === newHead[1])) {
          setGameOver(true);
          return prev;
        }
        let grows = (newHead[0] === food[0] && newHead[1] === food[1]);
        let newSnake = [newHead, ...prev];
        if (!grows) newSnake.pop();
        else setFood(randomFood(newSnake));
        return newSnake;
      });
      moving.current = false;
    }, 150);
    return () => clearInterval(interval);
  }, [dir, food, gameOver]);

  const drawTile = (x, y) => {
    let isFood = food[0] === x && food[1] === y;
    let isSnake = snake.some(([sx, sy]) => sx === x && sy === y);
    let bg = isFood
      ? "red"
      : isSnake
      ? "limegreen"
      : "#222";
    return <div key={`${x},${y}`} style={{
      width: 24, height: 24,
      background: bg,
      border: "1px solid #111",
      boxSizing: "border-box"
    }} />;
  };

  return (
    <div>
      <h2>Snake Game</h2>
      <div
        style={{
          display: "grid",
          gridTemplateRows: `repeat(${BOARD_SIZE}, 24px)`,
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 24px)`
        }}
      >
        {[...Array(BOARD_SIZE)].map((_, r) =>
          [...Array(BOARD_SIZE)].map((_, c) => drawTile(r, c))
        )}
      </div>
      {gameOver && <div style={{color:"red",marginTop:10}}>Game Over! Refresh to restart.</div>}
      <div style={{marginTop:10}}>Use arrow keys to play.</div>
    </div>
  );
}
