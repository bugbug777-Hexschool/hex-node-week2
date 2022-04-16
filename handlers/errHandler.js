const headers = require('../headers/corsHeader');

const errHandler = (res, statusCode, errors={}) => {
  const errContentInfo = {
    400: "請檢查資料格式，格式有誤！",
    404: "該頁面不存在"
  }
  const data = {
    status: 'false',
    errCode: statusCode,
    message: ''
  }

  data.message = errors.message || errContentInfo[statusCode];

  res.writeHead(statusCode, headers);
  res.write(JSON.stringify(data));
  res.end();
}

module.exports = errHandler;
