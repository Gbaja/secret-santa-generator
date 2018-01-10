BEGIN;

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS groups CASCADE;
DROP TABLE IF EXISTS names CASCADE;

CREATE TABLE users (
  id serial PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS groups (
  id serial PRIMARY KEY,
  userid INT REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR (50)
);

CREATE TABLE IF NOT EXISTS names (
  id serial PRIMARY KEY,
  userid INT REFERENCES users(id) ON DELETE CASCADE,
  groupid INT REFERENCES groups(id) ON DELETE CASCADE,
  name VARCHAR (100) NOT NULL,
  email VARCHAR(100) NOT NULL
);

INSERT INTO users (username, name, email, password) VALUES ('Fats', 'Fatimat', 'gbajaf@yahoo.co.uk', 'fatimat');
INSERT INTO groups (userid, title) VALUES ((SELECT id FROM users WHERE email = 'gbajaf@yahoo.co.uk'), 'Home');
INSERT INTO names (userid, groupid, name, email) VALUES ((SELECT id FROM users WHERE email = 'gbajaf@yahoo.co.uk'), (SELECT id FROM groups WHERE title = 'Home'), 'Habeeb', 'swankzhsgm@icloud.com');
INSERT INTO names (userid, groupid, name, email) VALUES ((SELECT id FROM users WHERE email = 'gbajaf@yahoo.co.uk'), (SELECT id FROM groups WHERE title = 'Home'), 'Rasheedat', 'rasheedat@gmail.com');

COMMIT;
