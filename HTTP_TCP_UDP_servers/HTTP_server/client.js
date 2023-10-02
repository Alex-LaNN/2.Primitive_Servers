import http from "http";

// The message that will be sent to the server.
const messageToSend = "Тест примитивного HTTP-сервера!";

// Fixing the initial time of the request.
const startTime = new Date().getTime();

// Request options.
const options = {
  // Host of the server to which the request is sent.
  hostname: "localhost",
  // Server port.
  port: 8000,
  // POST method to use.
  method: "POST",
  headers: {
    // Content type (text).
    "Content-Type": "text/plain",
    // Content length (in bytes).
    "Content-Length": Buffer.byteLength(messageToSend),
  },
};

// Create an HTTP request with the specified options.
const req = http.request(options, (res) => {
  let responseData = "";

  // "data" event handler for reading data received from the server.
  res.on("data", (partOfData) => {
    responseData += partOfData;
  });

  // "end" event handler to complete the request and display the results.
  res.on("end", () => {
    // Fixing the end time of response processing.
    const endTime = new Date().getTime();
    // Calculate the time spent on the request and response.
    const totalTime = endTime - startTime;

    // Output the received data and the request execution time.
    if (messageToSend === responseData) {
      console.log(
        `"${responseData}" -\nвсе переданные серверу данные вернулись без изменений!`
      );
    } else
      console.log(
        `От сервера вернулись данные, отличающиеся от переданных! \nПередано: "${messageToSend}"\nВернулось: "${responseData}"`
      );
    console.log(`Обмен данными был произведен за ${totalTime}(мс).`);
  });
});

// "error" event handler to handle request errors.
req.on("error", (error) => {
  console.error(`Произошла ошибка: ${error.message}`);
});

// Sending a message to the server.
req.write(messageToSend);
// Completing the request.
req.end();
