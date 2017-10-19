import express from 'express';
import path from 'path';
const app = express();

// homepage
app.get('/', function(req, res) {
  res.statusCode = 200;
  res.send('hello world');
});

// successful test
app.get('/200', function(req, res) {
  res.statusCode = 200;
  res.json({
    message: 'hello world'
  });
});

// rewrite rule - with proxy header
app.get('/305', function(req, res) {
  res.statusCode = 305;
  res.json({
    status: 'rewrite',
    location: 'http://localhost:3000'
  });
});

// this is a perminate redirect
app.get('/308', function(req, res) {
  res.statusCode = 308;
  res.location('http://localhost:3000');
  res.json({
    status: 301,
    location: 'http://localhost:3000'
  });
  res.send();
});

// this is for client implimentation
app.get('/client', function(req, res) {
  res.statusCode = 200;
  res.sendFile(path.resolve('static/index.htm'));
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});
