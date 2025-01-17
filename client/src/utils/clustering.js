function distance(a, b) {
  return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
}

function kMeans(data, k, maxIterations = 100) {
  // Randomly initialize k centroids
  let centroids = data.slice(0, k);
  let assignments = new Array(data.length).fill(0);
  let iterations = 0;

  while (iterations < maxIterations) {
    // Assign points to nearest centroid
    for (let i = 0; i < data.length; i++) {
      let minDistance = Infinity;
      let assignment = 0;
      for (let j = 0; j < k; j++) {
        let dist = distance(data[i], centroids[j]);
        if (dist < minDistance) {
          minDistance = dist;
          assignment = j;
        }
      }
      assignments[i] = assignment;
    }

    // Recompute centroids
    let newCentroids = new Array(k).fill(null).map(() => [0, 0]);
    let counts = new Array(k).fill(0);
    for (let i = 0; i < data.length; i++) {
      let assignment = assignments[i];
      newCentroids[assignment][0] += data[i][0];
      newCentroids[assignment][1] += data[i][1];
      counts[assignment]++;
    }
    for (let i = 0; i < k; i++) {
      if (counts[i] > 0) {
        newCentroids[i][0] /= counts[i];
        newCentroids[i][1] /= counts[i];
      }
    }

    // Check for convergence
    if (JSON.stringify(centroids) === JSON.stringify(newCentroids)) {
      break;
    }

    centroids = newCentroids;
    iterations++;
  }

  return assignments;
}

export { kMeans };