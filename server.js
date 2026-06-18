const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Route to serve the main game page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to handle game logic (if needed later)
app.post('/api/race', (req, res) => {
  const { country, gift } = req.body;
  res.json({ success: true, message: `${country} received ${gift}` });
});

app.listen(PORT, () => {
  console.log(`🎮 Game server running at http://localhost:${PORT}`);
});