const request = require('supertest');
const path = require('path');
const fs = require('fs').promises;
const os = require('os');
const { app, startServer } = require('../app');

describe('API Endpoints', () => {
  let tempFilePath;
  let server;

  beforeAll(async () => {
    await startServer();
  });

  beforeEach(async () => {
    tempFilePath = path.join(os.tmpdir(), 'test_embedding.json');
    await fs.writeFile(tempFilePath, JSON.stringify([1, 2, 3, 4, 5]));
  });

  afterEach(async () => {
    await fs.unlink(tempFilePath).catch(() => {});
  });

  test('POST /api/embeddings should load an embedding', async () => {
    const response = await request(app)
      .post('/api/embeddings')
      .send({ filePath: tempFilePath, name: 'Test Embedding' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('message', 'Embedding loaded successfully');
  });

  test('GET /api/embeddings/:id should retrieve an embedding', async () => {
    // First, load an embedding
    const postResponse = await request(app)
      .post('/api/embeddings')
      .send({ filePath: tempFilePath, name: 'Test Embedding' });

    const id = postResponse.body.id;

    // Then, retrieve it
    const getResponse = await request(app).get(`/api/embeddings/${id}`);

    expect(getResponse.statusCode).toBe(200);
    expect(getResponse.body).toHaveProperty('name', 'Test Embedding');
    expect(getResponse.body).toHaveProperty('data');
    expect(getResponse.body.data).toEqual([1, 2, 3, 4, 5]);
  });

  test('GET /api/embeddings/:id should return 404 for non-existent id', async () => {
    const response = await request(app).get('/api/embeddings/999');

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error', 'Embedding not found');
  });

  describe('File Upload API', () => {
    it('should upload a file and return processed data', async () => {
      const testFilePath = path.join(__dirname, 'test_data.csv');
      await fs.writeFile(testFilePath, '1,2\n3,4\n5,6');

      const response = await request(app)
        .post('/api/upload')
        .attach('file', testFilePath);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([[1, 2], [3, 4], [5, 6]]);

      await fs.unlink(testFilePath);
    });

    it('should return 400 if no file is uploaded', async () => {
      const response = await request(app)
        .post('/api/upload');

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error', 'No file uploaded');
    });
  });
});