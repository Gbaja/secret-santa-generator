const fs = require('fs');
const dbConnection = require('./database_connection');
const sql = fs.readFileSync(`${__dirname}/database_build.sql`).toString();

//Create project table
dbConnection.query(sql, (err, res) => {
  if (err) return err;
  console.log("Created table with result: ", res);
});


const runDbBuild = cb => {
 dbConnection.query(sql, (err, res) => {
     if (err) return cb(err);
     cb(null, res);
 });
};

module.exports = runDbBuild;
