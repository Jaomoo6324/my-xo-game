import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [boardSize, setBoardSize] = useState(3);
  const [board, setBoard] = useState([]);
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([]);
  const [winner, setWinner] = useState(null);
  const [winningCells, setWinningCells] = useState([]);
  const [gameHistories, setGameHistories] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isPlayerVsPlayer, setIsPlayerVsPlayer] = useState(true); 
  const [gameMode, setGameMode] = useState('1v1');  // ตัวแปรเก็บโหมดเกม

  useEffect(() => {
    if (gameStarted) initializeBoard();
    GameHistories();
  }, [boardSize, gameStarted]);

  // ให้บอทเล่นเมื่อถึงตาของมัน
  useEffect(() => {
    if (gameMode === '1vBot' && !xIsNext && !winner) {
      setTimeout(() => {
        botMove(board); // ให้บอททำการเคลื่อนไหวเมื่อถึงตาของมัน
      }, 500);
    }
  }, [xIsNext, winner, gameMode, board]);

  // ฟังก์ชันเริ่มเกมใหม่
  const initializeBoard = () => {
    setBoard(Array(boardSize).fill(null).map(() => Array(boardSize).fill(null)));
    setXIsNext(true);
    setWinner(null);
    setWinningCells([]);
    setShowPopup(false);
  };

  const handleGameMode = (mode) => {   // อัปเดต gameMode ตามโหมดที่เลือก
    setGameMode(mode);
    setIsPlayerVsPlayer(mode === '1v1'); // ถ้าเลือก '1v1' ก็คือ Player vs Player
    if (gameMode === null) {
      alert('กรุณาเลือกโหมดเกม');
      return;
    }
    setGameStarted(true);
    initializeBoard();
  };

  const handleClick = (row, col) => {
    if (winner || board[row][col]) return;
    const newBoard = board.map((rowArr, rowIndex) =>
      rowArr.map((cell, colIndex) =>
        rowIndex === row && colIndex === col ? (xIsNext ? 'X' : 'O') : cell
      )
    );
    setBoard(newBoard);
    setXIsNext(!xIsNext);
    setHistory([...history, newBoard]);
    const { currentWinner, cells } = calculateWinner(newBoard);
    if (currentWinner) {
      setWinner(currentWinner);
      setWinningCells(cells);
      setShowPopup(true);
    if (isPlayerVsPlayer) {     // ตรวจสอบว่าเป็นผู้เล่นกับผู้เล่นหรือผู้เล่นกับบอท
      saveGameHistory(newBoard, currentWinner); 
    } else {
      saveGameHistoryAI(newBoard, currentWinner); 
    }
      setHistory([...history, newBoard]);
      handleGameEnd(newBoard, currentWinner); // เรียก handleGameEnd เมื่อเกมจบ
    }else if (newBoard.flat().every(cell => cell !== null)) {
      setWinner(null);                        // ถ้าไม่มีช่องว่างในกระดานและไม่มีผู้ชนะ ให้แสดง popup เสมอ // ตั้งค่า winner เป็น null ในกรณีเสมอ
      setShowPopup(true);
    if (isPlayerVsPlayer) {  // ตรวจสอบว่าเป็นผู้เล่นกับผู้เล่นหรือผู้เล่นกับบอท
      saveGameHistory(newBoard, "เสมอ"); // ถ้าเป็นผู้เล่นกับผู้เล่น
    } else {
      saveGameHistoryAI(newBoard, "เสมอ"); // ถ้าเป็นผู้เล่นกับบอท
    }
      setHistory([...history, newBoard]); // อัปเดตประวัติ
      handleGameEnd(newBoard, "เสมอ"); // เรียก handleGameEnd เมื่อเกมจบ
    }
  };
  
  const calculateWinner = (board) => {
    const lines = [];
    const cells = [];
    for (let i = 0; i < boardSize; i++) {
      lines.push(board[i]);
      cells.push(board[i].map((_, col) => [i, col]));
      lines.push(board.map(row => row[i]));
      cells.push(board.map((_, row) => [row, i]));
    }
    lines.push(board.map((_, idx) => board[idx][idx]));
    cells.push(board.map((_, idx) => [idx, idx]));
    lines.push(board.map((_, idx) => board[idx][boardSize - 1 - idx]));
    cells.push(board.map((_, idx) => [idx, boardSize - 1 - idx]));
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].every(cell => cell === 'X')) return { currentWinner: 'X', cells: cells[i] };
      if (lines[i].every(cell => cell === 'O')) return { currentWinner: 'O', cells: cells[i] };
    }
    return { currentWinner: null, cells: [] };
  };

  // ฟังก์ชันตรวจสอบว่าเกมเสมอหรือไม่
  const checkDraw = (board) => {  // ตรวจสอบว่าทุกช่องถูกเติมเต็มหรือไม่
    return board.every(row => row.every(cell => cell !== null && cell !== ''));
  };

  const handleGameEnd = async (board) => {
    const { currentWinner, cells } = calculateWinner(board);
    let winner = currentWinner;
    if (winner === null && checkDraw(board)) {
      winner = "เสมอ";       // ถ้าทุกช่องถูกเติมเต็มและไม่มีผู้ชนะ ให้บันทึกว่าเสมอ
    }
  };

  const saveGameHistory = async (board, winner) => {
    try {           // ตรวจสอบว่าผู้เล่นเสมอกัน
      await axios.post('http://localhost:3001/api/save-history', {
        history: board,
        winner: winner
      });
    } catch (error) {
      console.error('Error saving history:', error);
    }
  };

  const GameHistories = async () => {
    try {                  // เช็คว่าเป็นผู้เล่นกับผู้เล่น หรือผู้เล่นกับบอท
      if (isPlayerVsPlayer) {                   // ถ้าเป็นผู้เล่นกับผู้เล่น
        const response = await axios.get('http://localhost:3001/api/get-history');
        setGameHistories(response.data);
      } else {                                      // ถ้าเป็นผู้เล่นกับบอท
        const response = await axios.get('http://localhost:3001/api/get-history-ai');
        setGameHistories(response.data);
      }
    } catch (error) {
      console.error('Error fetching game histories:', error);
    }
  };

  const saveGameHistoryAI = async (board, winner) => {
    try {
      await axios.post('http://localhost:3001/api/save-history-ai', {
        history: board,
        winner: winner
      });
    } catch (error) {
      console.error('Error saving history:', error);
    }
  };

  const exitToMainMenu = () => {
    setGameStarted(false);
    setBoardSize(3); // ตั้งค่าเริ่มต้นใหม่หากจำเป็น
    setGameMode(''); // รีเซ็ตโหมดเกม
    setWinner(null); // รีเซ็ตผู้ชนะ
  };

  const handleSizeChange = (e) => {
    setBoardSize(Number(e.target.value));
  };

  const [isLoading, setIsLoading] = useState(false);
  const botMove = (newBoard) => {
  if (!board || board.length === 0) {   // ตรวจสอบว่า board มีค่าหรือไม่
    setWinner(null);
    setShowPopup(true);
    return;
  }
  const hasEmptyCells = newBoard.some(row => row.includes(null));  // เช็คว่ามีช่องว่างหรือไม่
  if (!hasEmptyCells) {
    setWinner(null);  // ถ้าไม่มีช่องว่างเลย (กระดานเต็ม) ให้แสดง popup ว่าเสมอ
    setShowPopup(true);
     return;
  }
  setIsLoading(true); 
  const bestMove = getBestMove(newBoard, 'O');
  setTimeout(() => {
    handleClick(bestMove[0], bestMove[1]);
    setIsLoading(false); 
  }, 500); 
  };
  
  const getBestMove = (board, player) => {
    let bestScore = -Infinity;
    let move;
    // ประเมินการเคลื่อนไหวทุกตำแหน่งที่ว่าง
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        if (!board[i][j]) { // ถ้าเซลล์ยังว่าง
          board[i][j] = player;
          const score = minimax(board, 0, false, player);
          board[i][j] = null;
          if (score > bestScore) {
            bestScore = score;
            move = [i, j];
          }
        }
      }
    }
    return move;
  };
  
  const minimax = (board, depth, isMaximizing, player, alpha = -Infinity, beta = Infinity) => {
  const { currentWinner } = calculateWinner(board);
  if (currentWinner) {
    return currentWinner === player ? 10 - depth : depth - 10; // คะแนนตามการชนะ
  }

  if (board.flat().every(cell => cell !== null)) {
    return 0; // เสมอ
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        if (!board[i][j]) {
          board[i][j] = player;
          const score = minimax(board, depth + 1, false, player, alpha, beta);
          board[i][j] = null;
          bestScore = Math.max(score, bestScore);
          alpha = Math.max(alpha, bestScore);
          if (beta <= alpha) {
            break; // Alpha-Beta Pruning
          }
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    const opponent = player === 'X' ? 'O' : 'X';
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        if (!board[i][j]) {
          board[i][j] = opponent;
          const score = minimax(board, depth + 1, true, player, alpha, beta);
          board[i][j] = null;
          bestScore = Math.min(score, bestScore);
          beta = Math.min(beta, bestScore);
          if (beta <= alpha) {
            break; // Alpha-Beta Pruning
          }
        }
      }
    }
    return bestScore;
  }
};

  const closePopup = () => {
    setShowPopup(false);
    initializeBoard();
  };

  return (
    <div className="App-container">
      <h1 className="text-title">XO GAME</h1>
      {!gameStarted ? (
        <div className="game-mode-buttons">
          <div className="mt-3">
            {/* <button onClick={handleStartGame} className="btn btn-danger">ยินดีต้อนรับเข้าสู่เกม XO GAME</button> */}
            <h1>ยินดีต้อนรับเข้าสู่ เกม X O</h1>  
          </div>
          <div className="mt-3">
            <h2>เลือกโหมด ที่ต้องการเล่น</h2>  
          </div>
          <button 
            onClick={() => handleGameMode('1v1')} 
            className={`btn-game-mode2 ${gameMode === '1v1' ? 'selected' : ''}`}
          >
            ผู้เล่น vs ผู้เล่น 
          </button>
          <button 
            onClick={() => handleGameMode('1vBot')} 
            className={`btn-game-mode1 ${gameMode === '1vBot' ? 'selected' : ''}`}
          >
            ผู้เล่น  vs บอท
          </button>
          
        </div>
      ) : (
        <div className="d-flex justify-content-between">
          <div className="left-panel">
            <div className="form-group d-flex mb-4">
              <label className='size-table'>ขนาดตาราง:</label>
              <input
                type="number"
                min="3"
                max="7"
                value={boardSize}
                onChange={handleSizeChange}
                className="form-control"
              />
            </div>
            <div className="text-center mt-4">
        <button onClick={GameHistories} className="btn btn-info mx-2">แสดง ประวัติการเล่น</button>
      </div>
      <div className="history mt-4">
        <ul className="list-group mb-4">
          {gameHistories.slice().reverse().map((game, index) => (
            <li key={index} className="list-group-item">
              เกมที่ {gameHistories.length - index} - 
              {game.winner === "เสมอ" ? "" : "ผู้ชนะคือ: "} {game.winner === "เสมอ" ? "เสมอ" : game.winner}
            </li>
          ))}
        </ul>
      </div>
          </div>
          <div className="right-panel">
          <div className="text-name mt-4">
              <h2 className="text-name mt-4">{ winner ? `ผู้ชนะคือ: ${winner}` : `ถึงตาผู้เล่น: ${xIsNext ? 'X' : 'O'}`}</h2>
            </div>
            <div className="board">
              {board.map((row, rowIndex) => (
                <div key={rowIndex} className="board-row justify-content-center">
                  {row.map((cell, colIndex) => (
                    <button
                      key={colIndex}
                      className={`cell-btn ${winningCells.some(cell => cell[0] === rowIndex && cell[1] === colIndex) ? 'winning-cell' : ''}`}
                      onClick={() => handleClick(rowIndex, colIndex)}
                    >
                      {cell}
                    </button>
                  ))}
                </div>
              ))}
            </div>
            
            <div className="text-name mt-3">
              <button onClick={initializeBoard} className="btn2 btn2-success mx-2">เล่นใหม่</button>
              <button onClick={exitToMainMenu} className="btn3 btn-danger mx-2">ออก</button>
            </div>
          </div>
        </div>
        
      )}
  {showPopup && (
  <div className="popup-overlay">
    <div className="popup">
      {winner ? (
        <h3>เย้เย้เย้! ผู้ชนะคือ {winner}</h3>
      ) : (
        <h3>เกมเสมอ!</h3>
      )}
      <button onClick={closePopup} className="btn btn-success">ปิด</button>
    </div>
  </div>
)
}
    </div>
  );
}

export default App;