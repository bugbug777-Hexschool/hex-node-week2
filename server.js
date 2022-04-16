const http = require('http');
const mongoose = require('mongoose');
const headers = require('./headers/corsHeader');

mongoose.connect('mongodb://localhost:27017/posts')
  .then(() => {
    console.log('資料庫連線成功！');
  })

const reqListener = (req, res) => {
  if (req.url === '/posts' && req.method === 'GET') {
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      status: 'success',
      message: 'Get posts data.'
    }))
    res.end();
  } else if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write(JSON.stringify({
      status: 'false',
      message: 'Page is not found.'
    }))
    res.end()
  }
}

const server = http.createServer(reqListener);
server.listen(process.env.PORT || 8080);