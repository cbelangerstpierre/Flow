const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// sendFile will go here
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/index.css', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.css'));
});

app.get('/flow.js', function(req, res) {
  res.sendFile(path.join(__dirname, '/flow.js'));
});

app.listen(port);
console.log('Server started at http://localhost:' + port);