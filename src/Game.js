import React, { useState, useEffect } from 'react';
import Board from './Board';

const Game = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [isGameOver, setIsGameOver] = useState(false);
    const [mode, setMode] = useState('twoPlayer'); 
    const [playerSymbol, setPlayerSymbol] = useState(null); 
    const [aiSymbol, setAiSymbol] = useState(null); 

    const handleClick = (i) => {
        if (isGameOver || board[i] || (!isXNext && mode === 'ai')) return; 

        const newBoard = board.slice();
        newBoard[i] = isXNext ? playerSymbol : aiSymbol;
        setBoard(newBoard);

        const winner = calculateWinner(newBoard);
        if (winner) {
            setIsGameOver(true);
        } else if (newBoard.every(cell => cell !== null)) {
            setIsGameOver(true);
        } else {
            setIsXNext(!isXNext);
        }
    };

    useEffect(() => {
        if (!isXNext && mode === 'ai' && !isGameOver) {
            aiMove();
        }
    }, [isXNext, mode, isGameOver]);

    const aiMove = () => {
        const emptyCells = board.map((cell, index) => (cell === null ? index : null)).filter(cell => cell !== null);
        if (emptyCells.length === 0) return;

        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const newBoard = board.slice();
        newBoard[randomIndex] = aiSymbol;

        setBoard(newBoard);

        const winner = calculateWinner(newBoard);
        if (winner) {
            setIsGameOver(true);
        } else if (newBoard.every(cell => cell !== null)) {
            setIsGameOver(true);
        } else {
            setIsXNext(true);
        }
    };

    const calculateWinner = (squares) => {
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
                return squares[a];
            }
        }
        return null;
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
        setIsGameOver(false);
        setPlayerSymbol(null);
        setAiSymbol(null);
    };

    const handleSymbolSelection = (symbol) => {
        setPlayerSymbol(symbol);
        setAiSymbol(symbol === 'X' ? 'O' : 'X');
    };

    const handleModeSelection = (selectedMode) => {
        setMode(selectedMode);
    };

    const winner = calculateWinner(board);
    let status;
    if (winner) {
        status = `Winner: ${winner}`;
    } else if (isGameOver && board.every(cell => cell !== null)) {
        status = 'Draw!';
    } else {
        status = `Next player: ${isXNext ? playerSymbol : aiSymbol}`;
    }

    return (
        <div className="game">
            {playerSymbol ? (
                <>
                    <div className="status-display">{winner || (isGameOver && board.every(cell => cell !== null)) ? status : ''}</div>
                    <div className="game-board">
                        <Board squares={board} onClick={(i) => handleClick(i)} />
                    </div>
                    <div className="game-info">
                        <div>{!winner && !(isGameOver && board.every(cell => cell !== null)) && status}</div>
                        <button className="reset-game" onClick={resetGame}>Restart Game</button>
                        <div className="mode-buttons">
                            <button 
                                className={`mode-button ${mode === 'twoPlayer' ? 'active' : ''}`} 
                                onClick={() => handleModeSelection('twoPlayer')}
                            >
                                Two Player
                            </button>
                            <button 
                                className={`mode-button ${mode === 'ai' ? 'active' : ''}`} 
                                onClick={() => handleModeSelection('ai')}
                            >
                                Play with AI
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="symbol-selection">
                    <div>Choose your symbol:</div>
                    <button onClick={() => handleSymbolSelection('X')}>X</button>
                    <button onClick={() => handleSymbolSelection('O')}>O</button>
                </div>
            )}
        </div>
    );
};

export default Game;
