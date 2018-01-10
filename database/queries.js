const dbConnection = require('./database_connection.js');

const registerUser = (username, name, email, password, cb) => {
  dbConnection.query('INSERT INTO users (username, name, email, password) VALUES ($1, $2, $3, $4)', [username, name, email, password], (err, res) => {
    if (err) {
      console.log(err);
      cb(err);
    } else {
      cb(null, res);
    }
  })
}

const checkUserExits = (email, cb) => {
  dbConnection.query('SELECT EXISTS(SELECT email FROM users WHERE email = $1)', [email], (err, res) => {
    if(err){
      console.log(err)
      cb(err)
    } else {
      cb(null, res);
    }
  })
}

const getUserPasswordAndUsername = (email, cb) => {
  dbConnection.query('SELECT password, username from users where email = $1', [email], (err, res) => {
    if(err){
      console.log(err)
      cb(err)
    } else {
      cb(null, res);
    }
  })
}

const addNames = (userid, groupid, name, email, cb) => {
  dbConnection.query('INSERT INTO names (userid, groupid, name, email) VALUES ($1, $2, $3, $4)', [userid, groupid, name, email], (err, res) => {
    if (err) {
      console.log(err);
      cb(err);
    } else {
      cb(null, res);
    }
  })
}

const addGroup = (userid, title, cb) => {
  dbConnection.query('INSERT INTO groups (userid, title) VALUES ($1, $2) RETURNING id', [userid, title], (err, res) => {
    if (err) {
      console.log(err);
      cb(err);
    } else {
      cb(null, res);
    }
  })
}

const getUserID = (email, cb) => {
  dbConnection.query('SELECT id FROM users WHERE email = $1', [email], (err, res) => {
    if(err){
      cb(err)
    } else {
      cb(null, res);
    }
  })
}



const getUserGroupsAndParticipants = (userid, cb) => {
  dbConnection.query('SELECT groups.title, names.name, names.email FROM groups INNER JOIN names ON groups.userid = names.userid and groups.id = names.groupid and  names.userid = $1', [userid], (err, res) => {
    if(err){
      console.log(err)
      cb(err)
    } else {
      cb(null, res);
    }
  })
}

const checkGroupTitle = (title, cb) => {
  dbConnection.query('SELECT EXISTS(SELECT title FROM groups WHERE title = $1)', [title], (err, res) => {
    if(err){
      console.log(err)
      cb(err)
    } else {
      cb(null, res);
    }
  })
}

const deleteGroup = (title, userid, cb) => {
  dbConnection.query('DELETE FROM groups WHERE title = $1 AND userid = $2', [title, userid], (err, res) => {
    if(err){
      cb(err)
    } else {
      cb(null, res);
    }
  })
}

const deletePerson = (email, userid, title, cb) =>{
  dbConnection.query('DELETE FROM names WHERE email = $1 AND userid = $2 AND groupid = (SELECT id FROM groups WHERE title = $3)', [email, userid, title], (err, res) => {
    if(err){
      cb(err)
    } else {
      cb(null, res);
    }
  })
}

const getParticipantsDetails = (email, cb) => {
  dbConnection.query('SELECT groups.title, names.id, names.name, users.name AS creator FROM groups INNER JOIN names ON groups.userid = names.userid and groups.id = names.groupid and names.email = $1 INNER JOIN users ON names.userid = users.id', [email], (err, res) => {
    if(err){
      console.log(err)
      cb(err)
    } else {
      cb(null, res);
    }
  })
}

module.exports = {
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
}
