const http = require('http');
const port = process.env.PORT || 3000;
const router = require('./router.js');

const server = http.createServer(router);

server.listen(port, function(){
  console.log(`Server is now live on port ${port}`);
})
