#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

let serverProcess = null;
let restartCount = 0;
const maxRestarts = 5;
const restartDelay = 5000; // 5 seconds

function startServer() {
  console.log(`Starting server... (Restart count: ${restartCount})`);
  
  serverProcess = spawn('node', ['index.js'], {
    cwd: path.join(__dirname, 'api'),
    stdio: 'inherit'
  });

  serverProcess.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
    
    if (code !== 0 && restartCount < maxRestarts) {
      restartCount++;
      console.log(`Restarting server in ${restartDelay/1000} seconds...`);
      setTimeout(startServer, restartDelay);
    } else if (restartCount >= maxRestarts) {
      console.error('Max restart attempts reached. Server will not restart automatically.');
      process.exit(1);
    }
  });

  serverProcess.on('error', (err) => {
    console.error('Failed to start server:', err);
  });
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down monitor...');
  if (serverProcess) {
    serverProcess.kill('SIGINT');
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down monitor...');
  if (serverProcess) {
    serverProcess.kill('SIGTERM');
  }
  process.exit(0);
});

// Start the server
startServer();