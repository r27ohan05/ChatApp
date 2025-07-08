const socket = io();

const loginScreen = document.getElementById('login-screen');
const chatScreen = document.getElementById('chat-screen');
const usernameInput = document.getElementById('username');
const joinBtn = document.getElementById('join-btn');
const messages = document.getElementById('messages');
const input = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const statusBar = document.getElementById('status-bar');
const typing = document.getElementById('typing');

let username = '';

joinBtn.onclick = () => {
  username = usernameInput.value.trim();
  if (username) {
    socket.emit('join', { username });
    loginScreen.style.display = 'none';
    chatScreen.style.display = 'block';
  }
};

sendBtn.onclick = sendMessage;
input.onkeydown = (e) => {
  if (e.key === 'Enter') sendMessage();
  socket.emit('typing', username);
};
input.onkeyup = () => setTimeout(() => socket.emit('stop typing', username), 500);

function sendMessage() {
  const msg = input.value.trim();
  if (msg) {
    const time = new Date().toLocaleTimeString();
    addMessage({ msg, username: 'You', time }, true); // Show your message manually
    socket.emit('chat message', { msg, username, time });
    input.value = '';
  }
}



socket.on('chat message', (data) => {
  if (data.senderId !== mySocketId) {
    addMessage(data, false);
  }
});


socket.on('user-status', ({ username, status }) => {
  const statusMsg = document.createElement('div');
  statusMsg.textContent = `${username} is now ${status}`;
  statusMsg.style.color = 'gray';
  messages.appendChild(statusMsg);
});

socket.on('typing', (user) => {
  typing.textContent = `${user} is typing...`;
});

socket.on('stop typing', () => {
  typing.textContent = '';
});
let mySocketId = '';

socket.on('connect', () => {
  mySocketId = socket.id;
});
