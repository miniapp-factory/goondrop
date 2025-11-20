"use client";

import { useState, useEffect } from "react";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

const fruits = ["apple", "banana", "cherry", "lemon"];

function randomFruit() {
  return fruits[Math.floor(Math.random() * fruits.length)];
}

export default function SlotMachine() {
  const [grid, setGrid] = useState<string[][]>(
    Array.from({ length: 3 }, () => Array(3).fill(randomFruit()))
  );
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    if (!spinning) return;
    const interval = setInterval(() => {
      setGrid((prev) => {
        const newGrid = prev.map((row) => [...row]);
        for (let r = 2; r > 0; r--) {
          newGrid[r] = newGrid[r - 1];
        }
        newGrid[0] = Array(3).fill(randomFruit());
        return newGrid;
      });
    }, 200);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setSpinning(false);
      const rows = grid;
      const cols = Array.from({ length: 3 }, (_, c) => [
        grid[0][c],
        grid[1][c],
        grid[2][c],
      ]);
      const hasRowWin = rows.some((row) => row.every((f) => f === row[0]));
      const hasColWin = cols.some((col) => col.every((f) => f === col[0]));
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [spinning]);

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);
  };

  const hasRowWin = grid.some(row => row.every(f => f === row[0]));
  const hasColWin = Array.from({ length: 3 }, (_, c) => [
    grid[0][c],
    grid[1][c],
    grid[2][c],
  ]).some(col => col.every(f => f === col[0]));
  const win = !spinning && (hasRowWin || hasColWin);
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {grid.flat().map((fruit, idx) => (
          <img
            key={idx}
            src={`/${fruit}.png`}
            alt={fruit}
            className="w-16 h-16 object-contain"
          />
        ))}
      </div>
      <button
        onClick={handleSpin}
        disabled={spinning}
        className="px-4 py-2 rounded bg-primary text-primary-foreground disabled:opacity-50"
      >
        {spinning ? "Spinning..." : "Spin"}
      </button>
      {win && (
        <div className="flex flex-col items-center gap-2">
          <span className="text-xl font-bold">You win!</span>
          <Share text={`I just won the slot machine! ${url}`} />
        </div>
      )}
    </div>
  );
}
