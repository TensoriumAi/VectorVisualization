const express = require('express');
const path = require('path');
const DataManager = require('./DataManager');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const app = express();
const port = process.env.PORT || 5010;

// Pass the database file path to DataManager
const dataManager = new DataManager(path.join(__dirname, 'embeddings.db'));

app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/dist')));

// API endpoints
app.post('/api/embeddings', async (req, res) => {
  try {
    const { filePath, name } = req.body;
    const id = await dataManager.loadEmbedding(filePath, name);
    res.json({ id, message: 'Embedding loaded successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/embeddings/:id', async (req, res) => {
  try {
    const embedding = await dataManager.getEmbedding(req.params.id);
    if (embedding) {
      res.json(embedding);
    } else {
      res.status(404).json({ error: 'Embedding not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const id = await dataManager.loadEmbedding(req.file.path, req.file.originalname);
    const embedding = await dataManager.getEmbedding(id);

    res.json(embedding.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.get('/api/embeddings', async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 1000;
    const embeddings = await dataManager.getEmbeddingsBatch(offset, limit);
    res.json(embeddings);
  } catch (error) {
    console.error('Error fetching embeddings:', error);
    res.status(500).json({ error: 'Failed to load embeddings' });
  }
});

const startServer = async () => {
  await dataManager.initDatabase(); // Ensure this method exists
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };