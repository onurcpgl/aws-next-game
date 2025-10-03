'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

export default function SnakeGame() {
    const [snake, setSnake] = useState([[5, 5]]);
    const [food, setFood] = useState([10, 10]);
    const [dir, setDir] = useState([0, 1]);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const gridSize = 20;

    const generateFood = useCallback(() => {
        const newFood = [
            Math.floor(Math.random() * gridSize),
            Math.floor(Math.random() * gridSize)
        ];
        setFood(newFood);
    }, []);

    const changeDirection = (newDir) => {
        if (!isPlaying) return;

        // Ters yöne gitmeyi engelle
        if (newDir[0] === -dir[0] && newDir[1] === -dir[1]) return;

        setDir(newDir);
    };

    const resetGame = () => {
        setSnake([[5, 5]]);
        setDir([0, 1]);
        setGameOver(false);
        setScore(0);
        setIsPlaying(true);
        generateFood();
    };

    useEffect(() => {
        if (!isPlaying || gameOver) return;

        const moveSnake = () => {
            setSnake(prev => {
                const newHead = [prev[0][0] + dir[0], prev[0][1] + dir[1]];

                if (
                    newHead[0] < 0 || newHead[0] >= gridSize ||
                    newHead[1] < 0 || newHead[1] >= gridSize ||
                    prev.some(segment => segment[0] === newHead[0] && segment[1] === newHead[1])
                ) {
                    setGameOver(true);
                    setIsPlaying(false);
                    return prev;
                }

                const newSnake = [newHead, ...prev];

                if (newHead[0] === food[0] && newHead[1] === food[1]) {
                    setScore(s => s + 10);
                    generateFood();
                } else {
                    newSnake.pop();
                }

                return newSnake;
            });
        };

        const interval = setInterval(moveSnake, 150);
        return () => clearInterval(interval);
    }, [dir, food, gameOver, isPlaying, generateFood]);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (!isPlaying) return;

            switch (e.key) {
                case 'ArrowUp':
                    changeDirection([-1, 0]);
                    break;
                case 'ArrowDown':
                    changeDirection([1, 0]);
                    break;
                case 'ArrowLeft':
                    changeDirection([0, -1]);
                    break;
                case 'ArrowRight':
                    changeDirection([0, 1]);
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [dir, isPlaying]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-blue-500 p-4">
            <div className="bg-white rounded-lg shadow-2xl p-4 sm:p-6 max-w-md w-full">
                <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-gray-800">🐍 Yılan Oyunu</h1>

                <div className="mb-4 flex justify-between items-center">
                    <div className="text-lg sm:text-xl font-semibold text-black">Skor: {score}</div>
                    {!isPlaying && !gameOver && (
                        <button
                            onClick={resetGame}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold"
                        >
                            Başla
                        </button>
                    )}
                    {gameOver && (
                        <button
                            onClick={resetGame}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold"
                        >
                            Tekrar Oyna
                        </button>
                    )}
                </div>

                <div
                    className="relative bg-gray-900 rounded-lg mx-auto"
                    style={{
                        width: `${gridSize * 20}px`,
                        height: `${gridSize * 20}px`,
                        maxWidth: '100%',
                        aspectRatio: '1'
                    }}
                >
                    {snake.map((segment, i) => (
                        <div
                            key={i}
                            className="absolute bg-green-400 rounded-sm"
                            style={{
                                width: '18px',
                                height: '18px',
                                left: `${segment[1] * 20 + 1}px`,
                                top: `${segment[0] * 20 + 1}px`
                            }}
                        />
                    ))}

                    <div
                        className="absolute bg-red-500 rounded-full"
                        style={{
                            width: '16px',
                            height: '16px',
                            left: `${food[1] * 20 + 2}px`,
                            top: `${food[0] * 20 + 2}px`
                        }}
                    />

                    {gameOver && (
                        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-lg">
                            <div className="text-white text-center">
                                <div className="text-2xl sm:text-3xl font-bold mb-2">Oyun Bitti!</div>
                                <div className="text-lg sm:text-xl">Final Skor: {score}</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobil Kontroller */}
                <div className="mt-6 flex flex-col items-center gap-2">
                    <button
                        onClick={() => changeDirection([-1, 0])}
                        className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white w-16 h-16 rounded-lg flex items-center justify-center shadow-lg"
                    >
                        <ChevronUp size={32} />
                    </button>
                    <div className="flex gap-2">
                        <button
                            onClick={() => changeDirection([0, -1])}
                            className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white w-16 h-16 rounded-lg flex items-center justify-center shadow-lg"
                        >
                            <ChevronLeft size={32} />
                        </button>
                        <button
                            onClick={() => changeDirection([1, 0])}
                            className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white w-16 h-16 rounded-lg flex items-center justify-center shadow-lg"
                        >
                            <ChevronDown size={32} />
                        </button>
                        <button
                            onClick={() => changeDirection([0, 1])}
                            className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white w-16 h-16 rounded-lg flex items-center justify-center shadow-lg"
                        >
                            <ChevronRight size={32} />
                        </button>
                    </div>
                </div>

                <div className="mt-4 text-center text-sm text-gray-600">
                    Mobilde tuşları kullan • Bilgisayarda ok tuşları
                </div>
            </div>
        </div>
    );
}