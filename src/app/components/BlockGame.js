'use client';

import { useState, useEffect, useCallback } from 'react';
import { RotateCw, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

const ROWS = 20;
const COLS = 10;

const SHAPES = [
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[0, 1, 0], [1, 1, 1]], // T
    [[1, 0, 0], [1, 1, 1]], // L
    [[0, 0, 1], [1, 1, 1]], // J
    [[0, 1, 1], [1, 1, 0]], // S
    [[1, 1, 0], [0, 1, 1]], // Z
];

const COLORS = ['#00f0f0', '#f0f000', '#a000f0', '#f0a000', '#0000f0', '#00f000', '#f00000'];

export default function TetrisGame() {
    const [board, setBoard] = useState(Array(ROWS).fill(null).map(() => Array(COLS).fill(0)));
    const [current, setCurrent] = useState(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const createPiece = useCallback(() => {
        const index = Math.floor(Math.random() * SHAPES.length);
        return {
            shape: SHAPES[index],
            color: COLORS[index]
        };
    }, []);

    const checkCollision = useCallback((shape, pos) => {
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x]) {
                    const newX = pos.x + x;
                    const newY = pos.y + y;
                    if (newX < 0 || newX >= COLS || newY >= ROWS) return true;
                    if (newY >= 0 && board[newY][newX]) return true;
                }
            }
        }
        return false;
    }, [board]);

    const mergePiece = useCallback(() => {
        const newBoard = board.map(row => [...row]);
        current.shape.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell) {
                    const boardY = position.y + y;
                    const boardX = position.x + x;
                    if (boardY >= 0) {
                        newBoard[boardY][boardX] = current.color;
                    }
                }
            });
        });

        // Satır temizleme
        let linesCleared = 0;
        for (let y = ROWS - 1; y >= 0; y--) {
            if (newBoard[y].every(cell => cell !== 0)) {
                newBoard.splice(y, 1);
                newBoard.unshift(Array(COLS).fill(0));
                linesCleared++;
                y++;
            }
        }

        setBoard(newBoard);
        setScore(s => s + linesCleared * 100);

        const newPiece = createPiece();
        const newPos = { x: Math.floor(COLS / 2) - 1, y: 0 };

        if (checkCollision(newPiece.shape, newPos)) {
            setGameOver(true);
            setIsPlaying(false);
        } else {
            setCurrent(newPiece);
            setPosition(newPos);
        }
    }, [board, current, position, createPiece, checkCollision]);

    const moveDown = useCallback(() => {
        if (!current || gameOver) return;
        const newPos = { ...position, y: position.y + 1 };
        if (checkCollision(current.shape, newPos)) {
            mergePiece();
        } else {
            setPosition(newPos);
        }
    }, [current, position, checkCollision, mergePiece, gameOver]);

    const moveHorizontal = (dir) => {
        if (!current || gameOver) return;
        const newPos = { ...position, x: position.x + dir };
        if (!checkCollision(current.shape, newPos)) {
            setPosition(newPos);
        }
    };

    const rotate = () => {
        if (!current || gameOver) return;
        const rotated = current.shape[0].map((_, i) =>
            current.shape.map(row => row[i]).reverse()
        );
        if (!checkCollision(rotated, position)) {
            setCurrent({ ...current, shape: rotated });
        }
    };

    const drop = () => {
        if (!current || gameOver) return;
        let newPos = { ...position };
        while (!checkCollision(current.shape, { ...newPos, y: newPos.y + 1 })) {
            newPos.y++;
        }
        setPosition(newPos);
        mergePiece();
    };

    const startGame = () => {
        setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(0)));
        setScore(0);
        setGameOver(false);
        const piece = createPiece();
        setCurrent(piece);
        setPosition({ x: Math.floor(COLS / 2) - 1, y: 0 });
        setIsPlaying(true);
    };

    useEffect(() => {
        if (!isPlaying || gameOver) return;
        const interval = setInterval(moveDown, 500);
        return () => clearInterval(interval);
    }, [isPlaying, gameOver, moveDown]);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (!isPlaying || gameOver) return;
            e.preventDefault();

            switch (e.key) {
                case 'ArrowLeft':
                    moveHorizontal(-1);
                    break;
                case 'ArrowRight':
                    moveHorizontal(1);
                    break;
                case 'ArrowDown':
                    moveDown();
                    break;
                case 'ArrowUp':
                    rotate();
                    break;
                case ' ':
                    drop();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isPlaying, gameOver, position, current]);

    const renderBoard = () => {
        const displayBoard = board.map(row => [...row]);

        if (current) {
            current.shape.forEach((row, y) => {
                row.forEach((cell, x) => {
                    if (cell) {
                        const boardY = position.y + y;
                        const boardX = position.x + x;
                        if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
                            displayBoard[boardY][boardX] = current.color;
                        }
                    }
                });
            });
        }

        return displayBoard;
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 p-4">
            <div className="bg-gray-900 rounded-lg shadow-2xl p-4 sm:p-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-white">🧱 Tetris</h1>

                <div className="mb-4 flex justify-between items-center text-white">
                    <div className="text-xl font-semibold">Skor: {score}</div>
                    {!isPlaying && (
                        <button
                            onClick={startGame}
                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold"
                        >
                            {gameOver ? 'Tekrar Oyna' : 'Başla'}
                        </button>
                    )}
                </div>

                <div className="relative">
                    <div
                        className="grid gap-0 border-4 border-gray-700 bg-black mx-auto"
                        style={{
                            gridTemplateColumns: `repeat(${COLS}, 24px)`,
                            gridTemplateRows: `repeat(${ROWS}, 24px)`
                        }}
                    >
                        {renderBoard().map((row, y) =>
                            row.map((cell, x) => (
                                <div
                                    key={`${y}-${x}`}
                                    className="border border-gray-800"
                                    style={{
                                        width: '24px',
                                        height: '24px',
                                        backgroundColor: cell || '#111'
                                    }}
                                />
                            ))
                        )}
                    </div>

                    {gameOver && (
                        <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center rounded">
                            <div className="text-white text-center">
                                <div className="text-3xl font-bold mb-2">Oyun Bitti!</div>
                                <div className="text-xl">Skor: {score}</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobil Kontroller */}
                <div className="mt-6 flex flex-col items-center gap-3">
                    <div className="flex gap-2">
                        <button
                            onClick={rotate}
                            className="bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white w-16 h-16 rounded-lg flex items-center justify-center shadow-lg"
                        >
                            <RotateCw size={28} />
                        </button>
                        <button
                            onClick={drop}
                            className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white px-4 h-16 rounded-lg font-bold shadow-lg"
                        >
                            DROP
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => moveHorizontal(-1)}
                            className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white w-16 h-16 rounded-lg flex items-center justify-center shadow-lg"
                        >
                            <ChevronLeft size={32} />
                        </button>
                        <button
                            onClick={moveDown}
                            className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white w-16 h-16 rounded-lg flex items-center justify-center shadow-lg"
                        >
                            <ChevronDown size={32} />
                        </button>
                        <button
                            onClick={() => moveHorizontal(1)}
                            className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white w-16 h-16 rounded-lg flex items-center justify-center shadow-lg"
                        >
                            <ChevronRight size={32} />
                        </button>
                    </div>
                </div>

                <div className="mt-4 text-center text-sm text-gray-400">
                    Ok tuşları: Hareket • Yukarı: Döndür • Space: Drop
                </div>
            </div>
        </div>
    );
}