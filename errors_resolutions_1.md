This document will be where code errors are documented, and a description of how the error was resolved. This is an append-only document.

Begin ---
### Error: Babel SyntaxError - Support for the experimental syntax 'jsx' isn't currently enabled

**Resolution:**

- Created a `.babelrc` file in the project root with the following content:

  ```json
  {
    "presets": ["@babel/preset-env", "@babel/preset-react"]
  }
  ```

- Verified that `webpack.config.js` includes `.jsx` in the `resolve.extensions` array and properly configured `babel-loader`.

---

### Error: Module not found - Can't resolve 'react' and 'react-dom'

**Resolution:**

- Added `react` and `react-dom` to the `dependencies` in `package.json`:

  ```json
  // ... existing code ...
    "dependencies": {
      "express": "^4.18.2",
      "react": "^18.2.0",
      "react-dom": "^18.2.0"
    },
  // ... existing code ...
  ```

- Ran `npm install` to install the new dependencies.

---

### Error: sh: 1: concurrently: not found

**Resolution:**

- Moved `concurrently` from `devDependencies` to `dependencies` in `package.json`:

  ```json
  // ... existing code ...
    "dependencies": {
      "express": "^4.18.2",
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "concurrently": "^7.6.0"
    },
  // ... existing code ...
  ```

- Rebuilt the Docker image to include the updated dependencies.

---

### Error: Dockerfile using --only=dev for npm install

**Resolution:**

- Updated the Dockerfile to install all dependencies:

  ```Dockerfile
  # ... existing code ...
  
  # Install all dependencies (including dev dependencies)
  RUN npm install
  
  # ... rest of the file ...
  ```

- Changed the exposed port to 5010 to match `docker-compose.yml`.
- Updated the CMD to run the `dev` script:

  ```Dockerfile
  CMD ["npm", "run", "dev"]
  ```

- Rebuilt the Docker image to apply these changes.

---

### Port Change: Updated application to use port 5010

**Resolution:**

- Updated `server/app.js` to use port 5010:
  ```javascript
  const port = process.env.PORT || 5010;
  ```

- Updated Dockerfile to expose port 5010:
  ```Dockerfile
  EXPOSE 5010
  ```

- Updated `docker-compose.yml` to map port 5010:
  ```yaml
  ports:
    - '5010:5010'
  ```

- Ensured consistency across all components using port 5010.

---

### Added Testing Infrastructure

**Implementation:**

- Added Jest and related testing libraries to `package.json`.
- Created test files:
  - `server/__tests__/app.test.js` for server-side tests.
  - `client/src/__tests__/App.test.js` for client-side tests.
- Updated Dockerfile to include a test stage.
- Added a test service to docker-compose.yml.

**Running Tests:**

To run tests using Docker:

---

### Error: npm dependency conflict between React and @testing-library/react

**Resolution:**

- Updated `package.json` to use compatible versions of React and @testing-library/react:
  ```json
  "dependencies": {
    // ...
    "react": "^17.0.2",
    "react-dom": "^17.0.2",
    // ...
  },
  "devDependencies": {
    // ...
    "@testing-library/react": "^12.1.5",
    // ...
  }
  ```
- This change ensures that React version 17.x is used, which is compatible with @testing-library/react@12.1.5.
- After making this change, run `npm install` again to update the dependencies.

---

### Added New Scripts for Docker and Testing Operations

**Implementation:**

- Updated `package.json` with new scripts:
  ```json
  "scripts": {
    // ... existing scripts ...
    "docker:build": "docker-compose build",
    "docker:build:no-cache": "docker-compose build --no-cache",
    "docker:up": "docker-compose up",
    "docker:down": "docker-compose down",
    "docker:test": "docker-compose run test",
    "docker:dev": "docker-compose up app"
  }
  ```

**Usage:**

- To rebuild Docker images: `npm run docker:build`
- To rebuild Docker images without cache: `npm run docker:build:no-cache`
- To start the application in Docker: `npm run docker:up`
- To stop Docker containers: `npm run docker:down`
- To run tests in Docker: `npm run docker:test`
- To start the development environment in Docker: `npm run docker:dev`

These new scripts provide easy-to-use commands for common Docker operations and allow running the application and tests both with and without Docker.

---

### Error: Jest not found in Docker test environment

**Resolution:**

- Updated `Dockerfile` to ensure dev dependencies are installed in the test stage:
  ```Dockerfile
  # Test stage
  FROM node:16 AS test
  WORKDIR /app
  COPY --from=0 /app .
  # Ensure dev dependencies are installed for testing
  RUN npm install
  CMD ["npm", "test"]
  ```

- Moved Jest from `devDependencies` to `dependencies` in `package.json`:
  ```json
  "dependencies": {
    // ... other dependencies ...
    "jest": "^27.5.1"
  }
  ```

- Rebuilt the Docker image to apply these changes:
  ```
  npm run docker:build:no-cache
  ```

---

### Added .dockerignore file

**Implementation:**

- Created a `.dockerignore` file in the project root with the following content:
  ```
  # Ignore node_modules directory
  node_modules

  # Ignore package-lock.json
  package-lock.json

  # ... (other ignored files and directories)
  ```

**Reason:**
- Ignoring `node_modules` and `package-lock.json` helps reduce the Docker build context size.
- Prevents potential conflicts between local and container dependencies.
- Improves build performance by not copying unnecessary files.

---

### Optimization: Use npx to run node binaries

**Implementation:**

- Updated `Dockerfile` to use `npx` for running webpack and jest:
  ```Dockerfile
  # Build the client
  RUN npx webpack --config webpack.config.js --mode development

  # ... (in the test stage)
  CMD ["npx", "jest"]
  ```

- Updated `package.json` scripts to use `npx`:
  ```json
  "scripts": {
    "server": "npx nodemon server/app.js",
    "client": "npx webpack --config webpack.config.js --mode development",
    "dev": "npx concurrently \"npm run server\" \"npm run client\"",
    "test": "npx jest",
    "test:watch": "npx jest --watch",
    // ... other scripts remain unchanged
  }
  ```

**Reason:**
- Using `npx` allows running node binaries without installing packages globally.
- This approach is more flexible and avoids potential version conflicts.
- It ensures that the exact versions specified in `package.json` are used.

---

### Error: ReferenceError: require is not defined in ES module scope

**Error Details:**