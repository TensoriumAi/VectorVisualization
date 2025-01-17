const path = require('path');
const fs = require('fs').promises;
const os = require('os');
const DataManager = require('../dataManager');

describe('DataManager', () => {
  let dataManager;
  let tempDbPath;

  beforeEach(async () => {
    tempDbPath = path.join(os.tmpdir(), 'test_embeddings.db');
    dataManager = new DataManager(tempDbPath);
    await dataManager.initDatabase(); // Wait for database initialization
  });

  afterEach(async () => {
    await new Promise((resolve) => dataManager.db.close(resolve));
    await fs.unlink(tempDbPath).catch(() => {});
  });

  test('loadEmbedding should load JSON data', async () => {
    const testFilePath = path.join(__dirname, 'test_data.json');
    await fs.writeFile(testFilePath, JSON.stringify([1, 2, 3, 4, 5]));

    const id = await dataManager.loadEmbedding(testFilePath, 'Test Embedding');
    expect(id).toBeDefined();

    const embedding = await dataManager.getEmbedding(id);
    expect(embedding).toBeDefined();
    expect(embedding.name).toBe('Test Embedding');
    expect(embedding.data).toEqual([1, 2, 3, 4, 5]);

    await fs.unlink(testFilePath);
  });

  test('loadEmbedding should load CSV data', async () => {
    const testFilePath = path.join(__dirname, 'test_data.csv');
    await fs.writeFile(testFilePath, '1,2,3\n4,5,6');

    const id = await dataManager.loadEmbedding(testFilePath, 'Test CSV');
    expect(id).toBeDefined();

    const embedding = await dataManager.getEmbedding(id);
    expect(embedding).toBeDefined();
    expect(embedding.name).toBe('Test CSV');
    expect(embedding.data).toEqual([[1, 2, 3], [4, 5, 6]]);

    await fs.unlink(testFilePath);
  });

  test('getEmbedding should return null for non-existent id', async () => {
    const embedding = await dataManager.getEmbedding(999);
    expect(embedding).toBeNull();
  });
});