const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const errHandler = require('./handlers/errHandler');
const headers = require('./headers/corsHeader');
const PostModel = require('./models/PostModel');

// Load env config
dotenv.config({path: './config.env'});

const uri = process.env.DB_URI.replace(
  '<password>',
  process.env.DB_SECRET
)
mongoose.connect(uri)
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
        errHandler(res, 400, errors);
      }
    })
  } else if (req.url.startsWith('/posts/') && req.method === 'PATCH') {
    req.on('end', async () => {
      try {
        const id = req.url.split('/').pop();
        const data = JSON.parse(body);
        const editPost = await PostModel.findByIdAndUpdate(id, data);
        res.writeHead(200, headers);
        res.write(JSON.stringify({
          status: 'success',
          posts: editPost
        }))
        res.end();
      } catch (errors) {
        console.log(errors);
        errHandler(res, 400, errors);
      }
    })
  } else if (req.url === '/posts' && req.method === 'DELETE') {
    await PostModel.deleteMany({});
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      status: 'success',
      posts: []
    }))
    res.end();
  } else if (req.url.startsWith('/posts/') && req.method === 'DELETE') {
    try {
      const id = req.url.split('/').pop();
      const deletedPost = await PostModel.findByIdAndDelete(id);
      res.writeHead(200, headers);
      res.write(JSON.stringify({
        status: 'success',
        posts: deletedPost
      }))
      res.end();
    } catch (errors) {
      console.log(errors);
      errHandler(res, 400, errors);
    }
  } else if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  } else {
    errHandler(res, 404);
  }
}

const server = http.createServer(reqListener);
server.listen(process.env.PORT);