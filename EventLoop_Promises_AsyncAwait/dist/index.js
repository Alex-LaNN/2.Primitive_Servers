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
// The function returns 'Promise' to get a random name.
function getRandomName2() {
    return new Promise((resolve, reject) => {
        // Sending an asynchronous GET request to a specific API.
        fetch(randomNameApiUrl)
            .then((response) => {
            // Checking the success of the HTTP response.
            if (!response.ok) {
                throw new Error(`error HTTP in 3.3: ${response.status}`);
            }
            // Converting the response to JSON.
            return response.json();
        })
            .then((data) => {
            // Resolving 'Promise' with the received name.
            resolve(data.first_name);
        })
            .catch((error) => {
            // Rejecting 'Promise' with error.
            reject(error);
        });
    });
}
// The function returns 'Promise' to get three random names.
function getThreeNamesWithPromises() {
    const promises = [];
    // The function adds a random name to the 'promises' array (accumulating 3 names).
    function getNextName() {
        if (promises.length < 3) {
            promises.push(getRandomName2());
            getNextName();
        }
    }
    getNextName();
    return new Promise((resolve, reject) => {
        const results = [];
        // Function to check whether all names have been received.
        function checkComplete() {
            if (results.length === 3) {
                resolve(results);
            }
        }
        // Iterating through the "promises" array, processing each 'Promise'.
        promises.forEach((promise, index) => {
            promise
                .then((name) => {
                // Saving the received name in "results".
                results[index] = name;
                // Checking to see if all names have been received.
                checkComplete();
            })
                .catch((error) => {
                // Rejecting 'Promise' with "error".
                reject(error);
            });
        });
    });
}
// Using the 'getThreeNamesWithPromises()' function.
getThreeNamesWithPromises()
    .then((names) => console.log(`3.3) The query resulted in the following names: ${names}`))
    .catch((error) => console.error(`error in 3.3: ${error.message}`));
// The function returns 'Promise' to get a random user.
function getRandomUser() {
    return fetch(randomUserApiUrl).then((response) => {
        // We check the success of the HTTP response.
        if (!response.ok) {
            throw new Error(`error HTTP in 4.1: ${response.status}`);
        }
        // Convert the response to 'JSON' and specify the type explicitly.
        return response.json(); ///////////??????????????????????
    });
}
// Looks for a random female user and returns a 'Promise' with information about her.
function findRandomWoman() {
    // The function recursively gets a random user and checks their gender.
    function getNextUser() {
        return getRandomUser().then((user) => {
            // If the user is female.
            if (user.gender === "Female") {
                return user;
            }
            // If the user is not female, 'getNextUser()' is called again to get the next user.
            return getNextUser();
        });
    }
    // Start searching for a female user.
    return getNextUser();
}
// Using the 'findRandomWoman()' function.
findRandomWoman()
    .then((woman) => console.log(`4.1) Первый найденный 'User' женского пола:
      gender: ${JSON.stringify(woman.gender)}
      first_name: ${JSON.stringify(woman.first_name)}
      last_name: ${JSON.stringify(woman.last_name)}`))
    .catch((error) => console.error(`error in 4.1: ${error.message}`));
// 4.2 Finding a random female user using 'async/await'.
async function getRandomUserWithAsincAwait() {
    // Sending an asynchronous GET request to a specific API.
    const response = await fetch(randomUserApiUrl);
    // If the HTTP response is not successful, an error is thrown.
    if (!response.ok) {
        throw new Error(`error HTTP in 4.2: ${response.status}`);
    }
    return response.json();
}
// Function to find random female user using 'async/await'.
async function findRandomWomanWithAsincAwait() {
    // Getting a random female user.
    while (true) {
        const user = await getRandomUserWithAsincAwait();
        if (user.gender === "Female") {
            return user;
        }
    }
}
// Using the 'findRandomWomanWithAsincAwait()' function.
findRandomWomanWithAsincAwait()
    .then((woman) => console.log(`4.2) Первый найденный 'User' женского пола:
      gender: ${JSON.stringify(woman.gender)}
      first_name: ${JSON.stringify(woman.first_name)}
      last_name: ${JSON.stringify(woman.last_name)}`))
    .catch((error) => console.error(`error in 4.2: ${error.message}`));
// 5.
// Функция №1, которая принимает коллбек и вызывает его с текущим IP.
async function getIpAddress5(callback) {
    // 
    const data = await fetch(ipifyApiUrl);
    const ipAddress = await data.json();
    // Вызываем коллбек с IP-адресом.
    callback(ipAddress.ip);
}
// Функция №2, которую можно использовать с async/await и которая использует функцию №1.
async function useGetIpAddress() {
    return new Promise((resolve) => {
        // Вызываем функцию №1 и передаем ей коллбек.
        getIpAddress5((ipAddress) => {
            // Когда функция №1 вызывает коллбек с IP-адресом, мы разрешаем обещание (Promise).
            resolve(ipAddress);
        });
    });
}
// Пример использования функции №2 с async/await.
async function main() {
    try {
        const ipAddress = await useGetIpAddress();
        console.log(`5) Текущий IP-адрес: ${ipAddress}`);
    }
    catch (error) {
        console.error(`error in 4.2: ${error}`);
    }
}
// Запускаем основную функцию.
main();
