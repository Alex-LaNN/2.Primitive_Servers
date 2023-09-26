import fetch from "node-fetch";
// URL-адрес API для получения IP-адреса пользователя с форматом JSON.
const ipifyApiUrl = "https://api.ipify.org?format=json";
// URL для получения случайного имени с использованием Random Data API.
const randomNameApiUrl = "https://random-data-api.com/api/name/random_name";
// URL-адрес API для получения случайного 'User'а с использованием Random Data API.
const randomUserApiUrl = "https://random-data-api.com/api/users/random_user";
// 1.
// Sending an asynchronous GET request to an external API.
const response = await fetch(ipifyApiUrl);
// Parse the JSON response received from the server and store the result in the "data" variable.
const data = await response.json();
console.log("1) Your IP address: " + data.ip);
// 2. Asynchronous function to obtain the user's IP address.
async function getIpAddress() {
    try {
        // Sending an asynchronous GET request to an external API specifying the data format to be received.
        const response = await fetch(ipifyApiUrl);
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
        // Creating an array of promises for three requests.
        const promises = Array.from({ length: 3 }, async () => {
            // Sending a GET request to an external API.
            const response = await fetch(randomNameApiUrl);
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
    // Display an error message in case of any failure.
    console.error(`3.1) error: ${error.message}`);
});
// 3.2
// Asynchronous function to get a random name.
async function getRandomName() {
    try {
        // Sending an asynchronous GET request to an external API.
        const response = await fetch(randomNameApiUrl);
        // We parse the JSON response received from the server and extract the name value.
        const data = await response.json();
        return data.first_name;
    }
    catch (error) {
        // Catching exceptions to throw them further.
        throw error;
    }
}
// Asynchronous function to get three random names without using "Promise.all".
async function getNamesWithoutPromiseAll() {
    try {
        const names = [];
        // Loop to get three random names.
        for (let i = 0; i < 3; i++) {
            // Getting a random name.
            const name = await getRandomName();
            // Adding a name to the "names" array.
            names.push(name);
        }
        // Converts an array of names to a comma- and space-separated string.
        return names.join(", ");
    }
    catch (error) {
        // Catching exceptions to throw them further.
        throw error;
    }
}
// Getting three random names.
getNamesWithoutPromiseAll()
    .then((names) => console.log(`3.2) The query resulted in the following names: ${names}`))
    // Display an error message in case of any failure.
    .catch((error) => console.error(`error in 3.2: ${error.message}`));
// 3.3
// Функция возвращает 'Promise' для получения случайного имени.
function getRandomName2() {
    return new Promise((resolve, reject) => {
        // Отправка асинхронного GET-запроса к определенному API.
        fetch(randomNameApiUrl)
            .then((response) => {
            // Проверка успешности HTTP-ответа.
            if (!response.ok) {
                throw new Error(`error HTTP in 3.3: ${response.status}`);
            }
            // Преобразование ответа в JSON.
            return response.json();
        })
            .then((data) => {
            // Разрешение 'Promise'а с полученным именем.
            resolve(data.first_name);
        })
            .catch((error) => {
            // Отклонение 'Promise'а с ошибкой.
            reject(error);
        });
    });
}
// Функция возвращает 'Promise' для получения трех случайных имен.
function getThreeNamesWithPromises() {
    const promises = [];
    // Функция добавляет случайное имя в массив 'promises' (с накоплением 3х имен).
    function getNextName() {
        if (promises.length < 3) {
            promises.push(getRandomName2());
            getNextName();
        }
    }
    getNextName();
    return new Promise((resolve, reject) => {
        const results = [];
        // Функция для проверки: все ли имена получены.
        function checkComplete() {
            if (results.length === 3) {
                resolve(results);
            }
        }
        // Итерирование по массиву "promises" с обработкой каждого 'Promise'а.
        promises.forEach((promise, index) => {
            promise
                .then((name) => {
                // Сохранение полученного имени в "results".
                results[index] = name;
                // Проверка - все ли имена получены.
                checkComplete();
            })
                .catch((error) => {
                // Отклонение 'Promise'а с "error".
                reject(error);
            });
        });
    });
}
// Демонстрация использования функции 'getThreeNamesWithPromises()'.
getThreeNamesWithPromises()
    .then((names) => console.log(`3.3) The query resulted in the following names: ${names}`))
    .catch((error) => console.error(`error in 3.3: ${error.message}`));
// Функция возвращает 'Promise' для получения случайного пользователя.
function getRandomUser() {
    return fetch(randomUserApiUrl).then((response) => {
        // Проверяем успешность HTTP-ответа.
        if (!response.ok) {
            throw new Error(`error HTTP in 4.1: ${response.status}`);
        }
        // Преобразуем ответ в 'JSON' и явно указываем тип.
        return response.json();
    });
}
// Функция ищет случайного пользователя-женщину и возвращает 'Promise' с информацией о ней.
function findRandomWoman() {
    // Функция 'getNextUser()' рекурсивно получает случайного пользователя и проверяет его пол.
    function getNextUser() {
        return getRandomUser().then((user) => {
            if (user.gender === "Female") {
                return user;
            }
            // Если пользователь не является женщиной, вызывается снова 'getNextUser()', чтобы получить следующего пользователя.
            return getNextUser();
        });
    }
    // Начало поиска пользователя-женщины.
    return getNextUser();
}
// Демонсьрация использования функции 'findRandomWoman()'.
findRandomWoman()
    .then((woman) => console.log(`4.1)Первый найденный 'User' женского пола:
      gender: ${JSON.stringify(woman.gender)}
      first_name: ${JSON.stringify(woman.first_name)}
      last_name: ${JSON.stringify(woman.last_name)}`))
    .catch((error) => console.error(`error in 4.1: ${error.message}`));
// 4.2 Поиск пользователя женского пола c использованием 'async/await'.
async function getRandomUserWithAsincAwait() {
    // Отправка асинхронного GET-запроса к определенному API.
    const response = await fetch(randomUserApiUrl);
    // Если HTTP-ответ не успешен - выбработка ошибки.
    if (!response.ok) {
        throw new Error(`error HTTP in 4.2: ${response.status}`);
    }
    return response.json();
}
// Функция поиска случайного пользователя-женщины с использованием 'async/await'.
async function findRandomWomanWithAsincAwait() {
    // Получение случайного пользователя-женщины.
    while (true) {
        const user = await getRandomUserWithAsincAwait();
        if (user.gender === "Female") {
            return user;
        }
    }
}
// Пример использования функции 'findRandomWomanWithAsincAwait()'.
findRandomWomanWithAsincAwait()
    .then((woman) => console.log(`4.2) Первый найденный юзер женского пола:
      gender: ${JSON.stringify(woman.gender)}
      first_name: ${JSON.stringify(woman.first_name)}
      last_name: ${JSON.stringify(woman.last_name)}`))
    .catch((error) => console.error(`error in 4.2: ${error.message}`));
// 5.
