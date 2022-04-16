const http = require('http');
const headers = require('./headers/corsHeader');

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