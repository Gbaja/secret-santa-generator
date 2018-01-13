const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer')
const {
  registerUser,
  checkUserExits,
  getUserPasswordAndUsername,
  addNames,
  addGroup,
  getUserID,
  getUserGroupsAndParticipants,
  checkGroupTitle,
  deleteGroup,
  deletePerson,
  getParticipantsDetails
} = require('../database/queries.js');
const {pairEmails, drawEmails} = require('./logic')
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const secret = process.env.SECRET;


const homeHandler = (request, response) => {
  let filePath = path.join(__dirname, '..', 'public', 'index.html');
  fs.readFile(filePath, 'utf8', (err, file) => {
    if (err) {
      response.writeHead(500, {
        "Content-Type": 'text/plain'
      });
      response.end('server error');
    } else {
      response.writeHead(200, {
        "Content-Type": "text/html"
      });
      response.end(file);
    }
  })
}

const staticHandler = (request, response, endpoint) => {
  const extensionType = {
    html: 'text/html',
    css: 'text/css',
    js: 'application/javascript',
    ico: 'image/x-icon',
    jpg: 'image/jpg',
    png: 'image/png'
  }
  const extension = endpoint.split('.')[1];
  const filePath = path.join(__dirname, '..', endpoint);
  fs.readFile(filePath, (err, file) => {
    if (err) {
      response.writeHead(500, {
        "Content-Type": "text/plain"
      });
      response.end("Error");
    }
    response.writeHead(200, 'Content-Type: ' + extensionType[extension]);
    response.end(file);
  });
}

const profileHandler = (request, response) => {
  let filePath = path.join(__dirname, '..', 'public', 'profile.html');
  fs.readFile(filePath, 'utf8', (err, file) => {
    if (err) {
      response.writeHead(500, {
        "Content-Type": 'text/plain'
      });
      response.end('server error');
    } else if (!request.headers.cookie) {
      const message = 'You are not logged in';
      response.writeHead(401, {
        'Content-Type': 'text/plain'
      });
      return response.end(message);
    } else {
      response.writeHead(200, {
        "Content-Type": "text/html"
      });
      response.end(file);
    }
  })
}

const registerHandler = (request, response, endpoint) => {
  let registerData = '';
  request.on('data', (data) => {
    registerData += data;
  })
  request.on('end', () => {
    const userDetails = JSON.parse(registerData);
    //checkUser(user)
    bcrypt.genSalt(10, (saltErr, salt) => {
      if (saltErr) {
        response.writeHead(500);
        response.end('Internal Server Error, problem with generating salt');
      } else {
        bcrypt.hash(userDetails.password, salt, (hashError, hashedPassword) => {
          if (hashError) {
            response.writeHead(500);
            response.end('Internal Server Error, problem with generating Hashed password');
          } else {
            userDetails.password = hashedPassword;
            registerUser(userDetails.username, userDetails.name, userDetails.email, userDetails.password, (registerUserError, res) => {
              if (registerUserError) {
                response.writeHead(500);
                response.end('Internal Server Error, problem with addUser query');
              } else {
                const username = userDetails.username;
                getUserID(userDetails.email, (err, res) => {
                  if (err) {
                    throw err;
                  } else {
                    const userId = res.rows[0].id;
                    const token = jwt.sign({
                      'logged-in': 'true',
                      'userid': `${userId}`,
                      'username': `${username}`
                    }, secret);
                    const decoded = jwt.verify(token, secret);
                    response.writeHead(201, {
                      "Location": "/profile",
                      'Set-Cookie': `Token = ${token}; HttpOnly; secure:false, Max-Age=1000000;`
                    })
                    response.end();
                  }
                })
              }
            });
          }
        })
      }
    })
  })
}

const loginHandler = (request, response, endpoint) => {
  let loginData = '';
  request.on('data', (data) => {
    loginData += data;
  })
  request.on('end', () => {
    const userDetails = JSON.parse(loginData);
    checkUserExits(userDetails.email, (loginUserError, res) => {
      if (loginUserError) {
        throw loginUserError;
      } else {
        if (res.rows[0].exists === false) {
          response.writeHead(403, {
            "Content-Type": "text/plain"
          });
          return response.end('You do not have an account. Please sign up')
        } else if (res.rows[0].exists === true) {
          getUserPasswordAndUsername(userDetails.email, (loginUserError, res) => {
            bcrypt.compare(userDetails.password, res.rows[0].password, (bcryptError, bcryptRes) => {
              if (bcryptError) {
                response.writeHead(500);
                response.end('Internal Server Error, problem with bcrypt');
              } else if (bcryptRes === false) {
                response.writeHead(403, {
                  "Content-Type": "text/plain"
                });
                return response.end('The password you have entered is incorrect!');
              } else {
                const username = res.rows[0].username;
                getUserID(userDetails.email, (err, res) => {
                  if (err) {
                    throw err;
                  } else {
                    const userId = res.rows[0].id;
                    const token = jwt.sign({
                      'logged-in': 'true',
                      'userid': `${userId}`,
                      'username': `${username}`
                    }, secret);
                    const decoded = jwt.verify(token, secret);
                    response.writeHead(201, {
                      "Location": "/profile",
                      'Set-Cookie': `Token = ${token}; HttpOnly; secure:false, Max-Age=1000000;`
                    })
                    response.end();
                  }
                })
              }
            })
          })
        }
      }
    })
  })
}

const allParticipantsInfoHandler = (request, response, endpoint) => {
  let participantsData = '';
  request.on('data', (data) => {
    participantsData += data;
  })
  request.on('end', () => {
    const decoded = jwt.verify(cookie.parse(request.headers.cookie).Token, secret);
    const parsedparticipantsData = JSON.parse(participantsData);
    const titleData = parsedparticipantsData.slice(0, 1);
    parsedparticipantsData.shift();
    checkGroupTitle(titleData, (err, queryRes) => {
      if (queryRes.rows[0].exists === true) {
        response.writeHead(403, {
          "Content-Type": "text/plain"
        });
        return response.end('You have already created a group with this title. Please choose a new title');
      } else {
        addGroup(decoded.userid, titleData[0].title, (err, queryRes) => {
          if (err) {
            throw err
          } else {
            parsedparticipantsData.forEach((eachData) => {
              addNames(decoded.userid, queryRes.rows[0].id, eachData.name, eachData.email, (err, queryRes) => {
                if (err) {
                  throw err;
                } else {
                  response.writeHead(201, {
                    "Location": "/profile"
                  })
                  response.end();
                }
              })

            })
          }
        })
      }
    })
  })
}

const allUserGroupAndNames = (request, response, endpoint) => {
  const decoded = jwt.verify(cookie.parse(request.headers.cookie).Token, secret);
  getUserGroupsAndParticipants(decoded.userid, (err, res) => {
    response.writeHead(200, {
      "Content-Type": "text/plain"
    })
    response.end(JSON.stringify(res.rows));
  })
}



const drawNamesHandler = (request, response, endpoint) => {
  const decoded = jwt.verify(cookie.parse(request.headers.cookie).Token, secret);
  let participantsData = '';
  request.on('data', (data) => {
    participantsData += data;
  })
  request.on('end', () => {
    participantsData = JSON.parse(participantsData);
    const titleData = participantsData.slice(0, 1);
    participantsData.shift()
    var pairings = pairEmails(participantsData);
    pairings.forEach((emails) => {
      getParticipantsDetails(emails.receiver, (err, queryRes) => {
        if (err) {
          throw err
        } else {
           drawEmails(emails.sender, queryRes.rows[0].creator, queryRes.rows[0].title, queryRes.rows[0].name)
           response.writeHead(201, {
             "Location": "/profile"
           })
           response.end();
        }
      })
    })
  })
}

const deleteGroupHandler = (request, response, endpoint) => {
  const decoded = jwt.verify(cookie.parse(request.headers.cookie).Token, secret);
  let groupData = '';
  request.on('data', (data) => {
    groupData += data;
  })
  request.on('end', () => {
    groupData = JSON.parse(groupData);
    deleteGroup(groupData.title, decoded.userid, (err, queryRes) => {
      if (err) {
        throw err
      } else {
        response.writeHead(201, {
          "Location": "/profile"
        })
        response.end();
      }
    })
  })
}


const deletePersonHandler = (request, response, endpoint) => {
  const decoded = jwt.verify(cookie.parse(request.headers.cookie).Token, secret);
  let personData = '';
  request.on('data', (data) => {
    personData += data;
  })
  request.on('end', () => {
    personData = JSON.parse(personData);
    deletePerson(personData[0].email, decoded.userid, personData[1].title, (err, queryRes) => {
      if (err) {
        throw err
      } else {
        response.writeHead(201, {
          "Location": "/profile"
        })
        response.end();
      }
    })
  })
}
const editPersonHandler = (request, response, endpoint) => {
  const decoded = jwt.verify(cookie.parse(request.headers.cookie).Token, secret);
  let editData = '';
  request.on('data', (data) => {
    editData += data;
  })
  request.on('end', () => {
    editData = JSON.parse(editData);
    console.log(editData);
  })
}
module.exports = {
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
}
