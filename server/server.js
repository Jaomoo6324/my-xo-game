// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const gameHistory = require('../../my-xo-game/server/models/GameHistory');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// เส้นทาง API สำหรับบันทึกประวัติการเล่น
app.post('/api/save-history', async (req, res) => {
  const { history, winner } = req.body;
  try {
    await gameHistory.saveGameHistory(history, winner);
    res.status(200).json({ message: 'Game history saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save game history' });
  }
});

// เส้นทาง API สำหรับดึงประวัติการเล่นทั้งหมด
app.get('/api/get-history', async (req, res) => {
  try {
    const histories = await gameHistory.getGameHistories();
    res.status(200).json(histories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch game histories' });
  }
});

// เส้นทาง API สำหรับบันทึกประวัติการเล่น
app.post('/api/save-history-ai', async (req, res) => {
  const { history, winner } = req.body;
  try {
    await gameHistory.saveGameHistoryAI(history, winner);
    res.status(200).json({ message: 'Game history saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save game history' });
  }
});

// เส้นทาง API สำหรับดึงประวัติการเล่นทั้งหมด
app.get('/api/get-history-ai', async (req, res) => {
  try {
    const histories = await gameHistory.getGameHistoriesAI();
    res.status(200).json(histories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch game histories' });
  }
});

app.get('/api', async (req, res) => {
  try {
    res.status(200).json({ message: 'test-api' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch game histories' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});