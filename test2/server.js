const express = require('express');
const path = require('path');
const app = express();
const port = 5500;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'courseworkAPI.html'));
});

app.get('/home', (req, res) => {
    console.log(res.body)
    res.sendFile(path.join(__dirname, 'home.html'));
  });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});