const {
  homeHandler,
  staticHandler,
  registerHandler,
  loginHandler,
  profileHandler,
  allParticipantsInfoHandler,
  allUserGroupAndNames,
  drawNamesHandler,
  deleteGroupHandler,
  deletePersonHandler,
  editPersonHandler
} = require('./handler.js');

const router = (request, response) => {
  const endpoint = request.url;
  if (endpoint === '/') {
    homeHandler(request, response);
  } else if (endpoint.indexOf('/public') !== -1) {
    staticHandler(request, response, endpoint);
  } else if (endpoint.indexOf('/register') !== -1) {
    registerHandler(request, response, endpoint);
  } else if (endpoint.indexOf('/login') !== -1) {
    console.log('loggin in')
    loginHandler(request, response, endpoint);
  } else if (endpoint.indexOf('/profile') !== -1) {
    profileHandler(request, response);
  } else if (endpoint.indexOf('/allParticipantsInfo') !== -1) {
    allParticipantsInfoHandler(request, response, endpoint);
  } else if (endpoint.indexOf('/getAllNames') !== -1) {
    allUserGroupAndNames(request, response, endpoint)
  } else if (endpoint.indexOf('/deleteGroup') !== -1) {
    deleteGroupHandler(request, response, endpoint)
  }
  else if (endpoint.indexOf('/drawNames') !== -1) {
    drawNamesHandler(request, response, endpoint)
  } else if (endpoint.indexOf('/editPerson') !== -1) {
    editPersonHandler(request, response, endpoint)
  } else if (endpoint.indexOf('/deletePerson') !== -1) {
    deletePersonHandler(request, response, endpoint)
  }
  else {
    response.writeHead(404, {
      "Content-Type": "text/plain"
    });
    response.end("unknown url");
  }
}

module.exports = router;
