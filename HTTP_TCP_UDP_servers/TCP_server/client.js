import { Socket } from "net";

// Creating a new client socket.
const client = new Socket();

// The message that will be sent to the server.
const messageToSend = "Тест примитивного TCP-сервера!";
const serverPort = 2000;
const serverAddress = "localhost";
// Start time for sending the request.
const startTime = new Date().getTime();
let totalTime = 0;

// Connect to the server at the specified address and port.
client.connect(serverPort, serverAddress, () => {
  console.log(`Подключено к серверу: ${serverAddress}:${serverPort}`);

  // Sending a message to the server.
  client.write(messageToSend);
});

// The "data" event handler, called when data is received from the server.
client.on("data", (data) => {
  // Convert the received data into a string.
  const responseData = data.toString();
  // Fixing the end time of response processing.
  const endTime = new Date().getTime();

  // Calculate the time spent on the request and response.
  totalTime = endTime - startTime;
  // Analysis of the correct operation of the server with the output of the corresponding message.
  if (responseData === messageToSend) {
    console.log(
      `От сервера получено то же, что и было отправлено:\nОтправлено:    "${responseData}"`
    );
  } else
    console.log(
      `Данные, полученные от сервера, отличаются от отправленных на сервер!!! \nОтправлено:    "${messageToSend}"`
    );
  // Output the received data and the request execution time.
  console.log(`Получено:      "${responseData}"`);
  console.log(`Заняло времени: ${totalTime}(мс)`);
  // Closing the connection after receiving a response from the server.
  client.end();
});

// Setting the "error" event handler for the 'client' object.
client.on("error", (err) => {
  console.log(err);
});

// A "close" event handler, called when the connection is closed.
client.on("close", () => {
  console.log("Соединение закрыто.");
});
