import { createServer } from "net";
let host = "";
// Port for the server to listen for incoming connections.
const PORT = 2000;

// Creation of a TCP server.
const server = createServer((socket) => {
  // Obtaining the address of the socket connection with the client.
  const clientAddress = `${socket.remoteAddress}:${socket.remotePort}`;
  // Bringing the client's address to an easy-to-read format.
  const ipAddress = clientAddress.includes("::ffff:")
    ? clientAddress.split("::ffff:")[1]
    : clientAddress;
  host = ipAddress.split(":")[0];

  // A handler for the "data" event, which fires when data is received from the client.
  socket.on("data", (data) => {
    // Display information from the socket 'AddressInfo' object.
    console.dir(socket.address());
    // Convert the received data into a string.
    const requestData = data.toString();
    console.log(`Принято от клиента (${host}): "${requestData}"`);

    // Sending back to the client the data received from him.
    socket.write(data, () => {
      console.log(`Ответ клиенту (${host}):      "${data}"`);
    });
  });

  // Handler for the "end" event (when the client closes the connection).
  socket.on("end", () => {
    console.log(`Cоединениt с сервером закрыто клиентом: ${host}`);
    // Displays information about the number of bytes read from the socket and written to the socket.
    console.dir({
      bytesRead: socket.bytesRead,
      bytesWritten: socket.bytesWritten,
    });
  });

  // Handler for the "error" event for the socket.
  socket.on("error", (err) => {
    console.log(err);
  });
});

// Information about the server's operation.
server.listen(PORT, () => {
  console.log(`Сервер слушает на порту ${PORT}`);
});
