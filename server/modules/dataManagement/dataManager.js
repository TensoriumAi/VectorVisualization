const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

class DataManager {
  constructor(dbPath) {
    this.db = new sqlite3.Database(dbPath);
    this.initDatabase();
  }

  initDatabase() {
    return new Promise((resolve, reject) => {
      this.db.run(`
        CREATE TABLE IF NOT EXISTS embeddings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          data BLOB,
          metadata TEXT
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async loadEmbedding(filePath, name) {
    const fileContent = await fs.promises.readFile(filePath, 'utf8');
    const fileExtension = path.extname(filePath).toLowerCase();

    let data;
    switch (fileExtension) {
      case '.json':
        data = JSON.parse(fileContent);
        break;
      case '.csv':
      case '.tsv':
        // For simplicity, we're assuming CSV/TSV files are comma/tab-separated without a header
        const separator = fileExtension === '.csv' ? ',' : '\t';
        data = fileContent.split('\n').map(line => line.split(separator).map(Number));
        break;
      default:
        throw new Error('Unsupported file format');
    }

    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO embeddings (name, data) VALUES (?, ?)',
        [name, JSON.stringify(data)],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  async getEmbedding(id) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM embeddings WHERE id = ?',
        [id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row ? { ...row, data: JSON.parse(row.data) } : null);
        }
      );
    });
  }

  // Add more methods as needed
}

module.exports = DataManager;