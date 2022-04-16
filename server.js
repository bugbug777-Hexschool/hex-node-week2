const http = require('http');
const mongoose = require('mongoose');
const headers = require('./headers/corsHeader');
const PostModel = require('./models/PostModel');

mongoose.connect('mongodb://localhost:27017/posts')
  .then(() => {
    console.log('資料庫連線成功！');
  })

const reqListener = async (req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  })

  if (req.url === '/posts' && req.method === 'GET') {
    const posts = await PostModel.find();
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      status: 'success',
      posts: posts
    }))
    res.end();
  } else if (req.url === '/posts' && req.method === 'POST') {
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const newPost = await PostModel.create(data);
        res.writeHead(200, headers);
        res.write(JSON.stringify({
          status: 'success',
          posts: newPost
        }))
        res.end();
      } catch (errors) {
        if (Object.keys(errors).length === 0) {
          res.writeHead(400, headers);
          res.write(JSON.stringify({
            status: 'false',
            message: '請檢查資料格式，格式有誤！',
          }))
          res.end();
        } else {
          res.writeHead(400, headers);
          res.write(JSON.stringify({
            status: 'false',
            message: errors.message,
          }))
          res.end();
        }
      }
    })
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