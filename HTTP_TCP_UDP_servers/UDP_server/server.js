import { createSocket } from "dgram";
// Creating a UDP server socket.
const server = createSocket("udp4");

// The port on which the server will listen for incoming requests.
const PORT = 8000;
// The host for making the request.
const HOST = "localhost";

// A handler for the "message" event, that fires when a message is received.
server.on("message", (message, remote) => {
  // Collecting information about the client from whom the request came: address and port.
  const clientAddress = `${remote.address}:${remote.port}`;
  console.log(`Новое подключение от клиента: ${clientAddress}`);

  // Converts the received message into a string.
  const requestData = message.toString();
  console.log(`Принято от клиента (${clientAddress}): "${requestData}"`);

  // Sending a response to the same client from which the request came.
  server.send(message, remote.port, remote.address, (error) => {
    if (error) {
      // If an error occurred while sending a response, a message about it is displayed.
      console.error(`Ошибка при отправке ответа клиенту: ${error.message}`);
    } else {
      // If the response is sent successfully => display information about success and about closing the session.
      console.log(`Ответ клиенту (${clientAddress}): ${requestData}`);
      console.log(`Закрытие сессии с клиентом: ${clientAddress}`);
    }
  });
});

// Binding the server to the specified port and starting listening for incoming requests.
server.bind(PORT, () => {
  console.log(`Сервер запущен: http://${HOST}:${PORT}`);
});
