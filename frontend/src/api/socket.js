const socket = new WebSocket("ws://35.220.237.143:8080/ws");

const connect = cb => {
  console.log("Attempting Connection...");

  socket.onopen = () => {
    console.log("Successfully Connected");
  };

  socket.onmessage = message => {
    cb(message);
  };

  socket.onclose = event => {
    console.log("Socket Closed Connection: ", event);
  };

  socket.onerror = error => {
    console.log("Socket Error: ", error);
  };
};

const sendMessage = msg => {
  console.log("Sending message: ", msg);
  socket.send(msg);
}

export { connect, sendMessage };
