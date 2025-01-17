const fs = require('fs');
const path = require('path');

function generateSampleData(numPoints = 100, dimensions = 50) {
    const data = [];
    for (let i = 0; i < numPoints; i++) {
        const point = {};
        for (let j = 0; j < dimensions; j++) {
            point[`dim${j}`] = Math.random() * 2 - 1; // Random value between -1 and 1
        }
        data.push(point);
    }
    return data;
}

function saveToCsv(data, filename = 'sample_embeddings.csv') {
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(point => headers.map(h => point[h]).join(','))
    ].join('\n');
    const filePath = path.join(__dirname, '..', filename);
    fs.writeFileSync(filePath, csvContent);
}

const sampleData = generateSampleData();
saveToCsv(sampleData);

console.log("Sample data has been generated and saved to 'sample_embeddings.csv'");