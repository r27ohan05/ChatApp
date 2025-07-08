const users = {};

function addUser(id, username) {
  users[id] = { username };
}

function removeUser(id) {
  const user = users[id];
  delete users[id];
  return user;
}

module.exports = { addUser, removeUser };