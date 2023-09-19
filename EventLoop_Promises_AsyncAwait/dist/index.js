import fetch from "node-fetch";
// 1.
// Sending an asynchronous GET request to an external API.
const response = await fetch("https://api.ipify.org?format=json");
// Parse the JSON response received from the server and store the result in the "data" variable.
const data = await response.json();
console.log("1) Your IP address: " + data.ip);
// 2. Asynchronous function to obtain the user's IP address.
async function getIpAddress() {
    try {
        // Sending an asynchronous GET request to an external API specifying the data format to be received.
        const response = await fetch("https://api.ipify.org?format=json");
        // Parsing the JSON response received from the server and storing the result in the "data" variable.
        const data = await response.json();
        // Extracting the IP address from the received data.
        const ipAddress = data.ip;
        // Printing the IP address to the console.
        console.log(`2) Your IP address: ${ipAddress}`);
    }
    catch (error) {
        // If an error occurs, its message is output to the console.
        console.error("2) error: ", error);
    }
}
// Call the "getIpAddress" function to get the IP address.
getIpAddress();
// 3.1
// Function to get random names from external API.
async function getRandomNames() {
    try {
        const apiUrl = "https://random-data-api.com/api/name/random_name";
        // Creating an array of promises for three requests.
        const promises = Array.from({ length: 3 }, async () => {
            // Sending a GET request to an external API.
            const response = await fetch(apiUrl);
            // Checking the success of the HTTP response.
            if (!response.ok) {
                throw new Error(`3.1) error HTTP: ${response.status}`);
            }
            // Converting the response to JSON format.
            const data = await response.json();
            // Retrieving and returning "first_name" from data.
            return data.first_name;
        });
        // Execute all promises in parallel.
        const names = await Promise.all(promises);
        return names.join(", ");
    }
    catch (error) {
        // Catching exceptions to throw them further.
        throw error;
    }
}
// Calling a function and processing the results.
getRandomNames()
    .then((names) => {
    console.log(`3.1) The query resulted in the following names: ${names}`);
})
    .catch((error) => {
    // Display an error message in case of failure.
    console.error(`3.1) error: ${error.message}`);
});
// 3.2
// Асинхронная функция для получения случайного имени.
async function getRandomName() {
    try {
        // Отправляем асинхронный GET-запрос к внешнему API.
        const response = await fetch("https://random-data-api.com/api/name/random_name");
        // Парсим JSON-ответ, полученный от сервера, и извлекаем значение имени.
        const data = await response.json();
        return data.first_name;
    }
    catch (error) {
        // Если произошла ошибка, выбрасываем её дальше.
        throw error;
    }
}
// Асинхронная функция для получения трех случайных имен без использования "Promise.all".
async function getNamesWithoutPromiseAll() {
    try {
        const names = [];
        // Цикл для получения трёх случайных имён.
        for (let i = 0; i < 3; i++) {
            // Получение случайного имени.
            const name = await getRandomName();
            // Добавление имени в массив "names".
            names.push(name);
        }
        // Преобразование массива имен в строку, разделенную запятыми.
        return names.join(", ");
    }
    catch (error) {
        // Если произошла ошибка, выбрасываем её дальше.
        throw error;
    }
}
// Получение трех случайных имен.
getNamesWithoutPromiseAll()
    .then((names) => console.log(`3.2) The query resulted in the following names: ${names}`))
    .catch((error) => console.error(`error in 3.2: ${error.message}`));
