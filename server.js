#!/usr/bin/env node
const express = require('express');
const path = require('path');

const PORT = 5000;
const app = express();

// Disable caching middleware
app.use((req, res, next) => {
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  next();
});

// Serve static files from current directory
app.use(express.static(__dirname));

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serving EGCA Tournament website at http://0.0.0.0:${PORT}`);
  console.log('Press Ctrl+C to stop the server');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nServer stopped.');
  process.exit(0);
});