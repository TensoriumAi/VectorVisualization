const sqlite3 = require('sqlite3').verbose();

class DataManager {
  constructor(databaseFile) {
    this.db = new sqlite3.Database(databaseFile);
  }

  // Add the initDatabase method
  initDatabase() {
    return new Promise((resolve, reject) => {
      this.db.run(
        `CREATE TABLE IF NOT EXISTS embeddings (
          id INTEGER PRIMARY KEY,
          data TEXT
        )`,
        (err) => {
          if (err) {
            console.error('Database initialization error:', err);
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  loadEmbedding(filePath, name) {
    // Implementation depends on file format. For CSV:
    const data = fs.readFileSync(filePath, 'utf8')
      .split('\n')
      .map(line => line.split(',').map(Number));
    
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare('INSERT INTO embeddings (data) VALUES (?)');
      stmt.run(JSON.stringify(data), function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
  }

  getEmbeddingsBatch(offset = 0, limit = 1000) {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT id, data FROM embeddings LIMIT ? OFFSET ?',
        [limit, offset],
        (err, rows) => {
          if (err) {
            console.error('Database error:', err);
            reject(err);
          } else {
            resolve(rows.map(row => ({
              id: row.id,
              data: JSON.parse(row.data)
            })));
          }
        }
      );
    });
  }

  // ... existing methods ...
}

module.exports = DataManager;