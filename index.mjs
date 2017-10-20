import express from 'express';
import path from 'path';
const app = express();

// landing page
app.get('/', function(req, res) {
  res.statusCode = 200;
  res.send('redirect-rewrite-poc');
});

// success
app.get('/200', function(req, res) {
  res.statusCode = 200;
  res.json({
    message: 'hello world'
  });
});

// client error
app.get('/404', function(req, res) {
  res.statusCode = 404;
  res.json({
    error: 'not found'
  });
});

// server error
app.get('/503', function(req, res) {
  res.statusCode = 503;
  res.json({
    error: 'broken'
  });
});

// rewrite rule - with proxy header
// body tells the client what to do
app.get('/305', function(req, res) {
  res.statusCode = 305;
  res.json({
    status: 200,
    location: 'http://localhost:3000'
  });
});

// redirect rule - with perminate redirect header and locaction
// body tells the client what to do
app.get('/308', function(req, res) {
  res.statusCode = 308;
  res.location('http://localhost:3000');
  res.json({
    status: 301,
    location: 'http://localhost:3000'
  });
  res.send();
});

// server client page - for testing browser responses
app.get('/client', function(req, res) {
  res.statusCode = 200;
  res.sendFile(path.resolve('static/index.htm'));
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});
