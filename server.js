const http = require('http');
const mongoose = require('mongoose');
const headers = require('./headers/corsHeader');
const PostModel = require('./models/PostModel');

mongoose.connect('mongodb://localhost:27017/posts')
  .then(() => {
    console.log('資料庫連線成功！');
  })

const reqListener = async (req, res) => {
  if (req.url === '/posts' && req.method === 'GET') {
    const posts = await PostModel.find();
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      status: 'success',
      posts: posts
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