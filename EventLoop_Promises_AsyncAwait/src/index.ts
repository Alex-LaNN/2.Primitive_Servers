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
    const data: any = await response.json();
    // Extracting the IP address from the received data.
    const ipAddress: string = data.ip;
    // Printing the IP address to the console.
    console.log(`2) Your IP address: ${ipAddress}`);
  } catch (error) {
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
  } catch (error) {
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
  } catch (error) {
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
  } catch (error) {
    // Catching exceptions to throw them further.
    throw error;
  }
}

// Getting three random names.
getNamesWithoutPromiseAll()
  .then((names) =>
    console.log(`3.2) The query resulted in the following names: ${names}`)
  )
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
  const promises: any[] = [];

  // The function adds a random name to the 'promises' array (accumulating 3 names).
  function getNextName() {
    if (promises.length < 3) {
      promises.push(getRandomName2());
      getNextName();
    }
  }

  getNextName();

  return new Promise((resolve, reject) => {
    const results: String[] = [];

    // Function to check whether all names have been received.
    function checkComplete() {
      if (results.length === 3) {
        resolve(results);
      }
    }

    // Iterating through the "promises" array, processing each 'Promise'.
    promises.forEach((promise, index) => {
      promise
        .then((name: String) => {
          // Saving the received name in "results".
          results[index] = name;
          // Checking to see if all names have been received.
          checkComplete();
        })
        .catch((error: any) => {
          // Rejecting 'Promise' with "error".
          reject(error);
        });
    });
  });
}

// Using the 'getThreeNamesWithPromises()' function.
getThreeNamesWithPromises()
  .then((names) =>
    console.log(`3.3) The query resulted in the following names: ${names}`)
  )
  .catch((error) => console.error(`error in 3.3: ${error.message}`));

// 4.1 Finding a female user without using 'async/await'.
// Structure of the 'User' object.
interface User {
  gender: string; // User gender (for example, "Male" or "Female").
  first_name: string; // Username.
  last_name: string; //  User's last name.
}
// The function returns 'Promise' to get a random user.
function getRandomUser(): Promise<User> {
  return fetch(randomUserApiUrl).then((response) => {
    // We check the success of the HTTP response.
    if (!response.ok) {
      throw new Error(`error HTTP in 4.1: ${response.status}`);
    }
    // Convert the response to 'JSON' and specify the type explicitly.
    return response.json();
  });
}

// Looks for a random female user and returns a 'Promise' with information about her.
function findRandomWoman(): Promise<User> {
  // The function recursively gets a random user and checks their gender.
  function getNextUser(): Promise<User> {
    return getRandomUser().then((user: User) => {
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
  .then((woman) =>
    console.log(
      `4.1) Первый найденный 'User' женского пола:
      gender: ${JSON.stringify(woman.gender)}
      first_name: ${JSON.stringify(woman.first_name)}
      last_name: ${JSON.stringify(woman.last_name)}`
    )
  )
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
  .then((woman) =>
    console.log(
      `4.2) Первый найденный 'User' женского пола:
      gender: ${JSON.stringify(woman.gender)}
      first_name: ${JSON.stringify(woman.first_name)}
      last_name: ${JSON.stringify(woman.last_name)}`
    )
  )
  .catch((error) => console.error(`error in 4.2: ${error.message}`));

// 5.
// Function #1, which accepts a callback and calls it with the current IP.
async function getIpAddress5(callback: any) {
  // Sending an asynchronous GET request to an external API.
  const data = await fetch(ipifyApiUrl);
  // Parse the JSON response received from the server.
  const ipAddressData = await data.json();
  // Call a callback with an IP address.
  callback(ipAddressData.ip);
}

// Function #2, which can be used with async/await and which uses function #1.
async function useGetIpAddress() {
  return new Promise((resolve) => {
    // Calling function No. 1 and passing a callback to it.
    getIpAddress5((ipAddress: any) => {
      resolve(ipAddress);
    });
  });
}

// Using feature #2 with async/await.
async function run() {
  try {
    const ipAddress = await useGetIpAddress();
    console.log(`5) Your IP address: ${ipAddress}`);
  } catch (error) {
    console.error(`error in 4.2: ${error}`);
  }
}

run();

// 6.
// Function No.1 for getting the current IP address and calling a callback with this IP.
async function getIpAddress6(callback: any) {
  // Sending an asynchronous GET request to an external API.
  const response = await fetch(ipifyApiUrl);
  // Parse the JSON response received from the server and store the result in the "data" variable.
  const data = await response.json();
  const ipAddress = data.ip;
  // Calling the passed callback with an IP address.
  callback(ipAddress);
}

// Function No.2, which uses function #1 to get the IP address and calls the passed callback.
function useGetIpAddress6(callback: any) {
  // Calls function #1 to get the current IP address.
  getIpAddress6((ipAddress: any) => {
    // When an IP address is received, the passed callback is called with that IP.
    callback(ipAddress);
  });
}

// Using function No.2 with passing a callback.
useGetIpAddress6((ipAddress: any) => {
  console.log(`6) Your IP address: ${ipAddress}`);
});
