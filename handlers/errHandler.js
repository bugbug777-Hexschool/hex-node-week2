const headers = require('../headers/corsHeader');

const errHandler = (res, statusCode, errors={}) => {
  const data = {
    status: 'false',
    errCode: statusCode,
    message: ''
  }
  
  if (statusCode && Object.keys(errors).length === 0) {
    data.message = "請檢查資料格式，格式有誤！";
  } else {
    data.message = errors.message;
  }

  res.writeHead(statusCode, headers);
  res.write(JSON.stringify(data));
  res.end();
}

module.exports = errHandler;
