// GameHistory.js
const mysql = require('mysql2/promise');

// สร้างการเชื่อมต่อกับ MySQL
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',  // ชื่อผู้ใช้ MySQL ของคุณ
  password: '1234',  // รหัสผ่าน MySQL ของคุณ
  database: 'xo_game',
});

// ฟังก์ชันบันทึกประวัติการเล่น
async function saveGameHistory(history, winner) {
  try {
    console.log('Saving game history...', history, winner); // ตรวจสอบข้อมูลที่รับมา
    const [result] = await db.query(
      'INSERT INTO game_history (history, winner) VALUES (?, ?)',
      [JSON.stringify(history), winner]
    );
    console.log("save-sussess")
    return result.insertId;
  } catch (error) {
    console.error('Error saving game history:', error);
    throw error;
  }
}

// ฟังก์ชันดึงประวัติการเล่นทั้งหมด
async function getGameHistories() {
  try {
    const [rows] = await db.query('SELECT * FROM game_history ORDER BY created_at ASC');
    return rows;
  } catch (error) {
    console.error('Error fetching game histories:', error);
    throw error;
  }
}

// ฟังก์ชันบันทึกประวัติการเล่น
async function saveGameHistoryAI(history, winner) {
  try {
    console.log('Saving game history...', history, winner); // ตรวจสอบข้อมูลที่รับมา
    const [result] = await db.query(
      'INSERT INTO game_history_ai (history, winner) VALUES (?, ?)',
      [JSON.stringify(history), winner]
    );
    console.log("save-sussess")
    return result.insertId;
  } catch (error) {
    console.error('Error saving game history AI:', error);
    throw error;
  }
}

// ฟังก์ชันดึงประวัติการเล่นทั้งหมด
async function getGameHistoriesAI() {
  try {
    const [rows] = await db.query('SELECT * FROM game_history_ai ORDER BY created_at ASC');
    return rows;
  } catch (error) {
    console.error('Error fetching game histories Ai:', error);
    throw error;
  }
}

module.exports = {
  saveGameHistory,
  getGameHistories,
  saveGameHistoryAI,
  getGameHistoriesAI,
};