import { createSocket } from "dgram";
// Creating a UDP client socket.
const client = createSocket("udp4");

// The message that will be sent to the server.
const messageToSend = "Тест примитивного UDP-сервера!";
// Parameters of the server to which the request will be sent.
const serverPort = 8000;
const serverAddress = "localhost";

// Start time for sending the request.
const startTime = new Date().getTime();

// Sending a message to the server.
client.send(messageToSend, serverPort, serverAddress, (error) => {
  if (error) {
    // If an error occurred while sending, a message about this is displayed.
    console.error(`Ошибка при отправке сообщения серверу: ${error.message}`);
  } else {
    // If the message is sent successfully, a handler for the "message" event is set.
    client.on("message", (message) => {
      // Converts the received message into a string.
      const responseData = message.toString();
      // Fixing the end time of response processing.
      const endTime = new Date().getTime();
      // Calculate the time spent on the request and response.
      const totalTime = endTime - startTime;

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

      // Closing the client socket after receiving a response.
      client.close();
    });
  }
});
