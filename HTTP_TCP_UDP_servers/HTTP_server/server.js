import http from "http";

// The port on which the server will listen for incoming requests.
const PORT = 8000;
// The host for making the request.
const HOST = "localhost";

// Create an HTTP server and define its request handler.
const server = http.createServer((req, res) => {
  const { method, url } = req;

  // Displays information about the client's new connection and its IP address.
  const clientAddress = req.socket.remoteAddress;
  const ipAddress = clientAddress.includes("::ffff:")
    ? clientAddress.split("::ffff:")[1]
    : clientAddress;
  console.log(`Новое подключение от клиента: ${ipAddress}`);

  let requestData = "";

  // "data" event handler for reading data received from the client.
  req.on("data", (partOfTheData) => {
    requestData += partOfTheData;
  });

  // "end" event handler to complete the request and send the response.
  req.on("end", () => {
    // Output of data received from the client.
    console.log(`Принято от клиента: ${requestData}`);

    // Setting the Content-Type header for the response to "text/plain".
    res.setHeader("Content-Type", "text/plain");
    // Set the response code.
    res.statusCode = 200;

    // Sending back data received from the client.
    res.end(requestData);

    // Display information about what was sent to the client.
    console.log(`Ответ клиенту: ${requestData}`);

    // Closing the connection with the client and displaying information about it.
    console.log(`Закрытие соединения с клиентом: ${ipAddress}`);
  });
});

// Starts the server on the specified port and displays a startup message.
server.listen(PORT, () => {
  console.log(`Сервер запущен: http://${HOST}:${PORT}`);
});
