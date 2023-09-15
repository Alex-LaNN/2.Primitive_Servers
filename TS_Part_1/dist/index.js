"use strict";
console.log("Hello!!! I'll try to compile this...");
// 1. Function to get the length of the first word from a string.
function getFirstWord(a) {
    return a.split(/ +/)[0].length;
}
// 2. Function for obtaining information about the user using his first and last name.
function getUserNamings(a) {
    return {
        fullname: a.name + " " + a.surname,
        initials: a.name[0] + "." + a.surname[0],
    };
}
// 3. Function to get all product names from an array of product objects.
// <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining>
function getAllProductNames(a) {
    var _a;
    return ((_a = a === null || a === void 0 ? void 0 : a.products) === null || _a === void 0 ? void 0 : _a.map((prod) => prod === null || prod === void 0 ? void 0 : prod.name)) || [];
}
// 4.1 A function to create a welcome message based on some object 'a'.
// easy way is using 'as' keyword
// hard way is ?...
function hey(a) {
    return "hey! i'm " + a.name();
}
hey({ name: () => "roma", cuteness: 100 });
hey({ name: () => "vasya", coolness: 100 });
// Abstract class 'abstractPet' implementing the 'Pet' interface.
class abstractPet {
    constructor(anyKey) {
        this.anyKey = anyKey;
    }
}
// Class 'Cat', inheriting from 'abstractPet'.
class Cat extends abstractPet {
    constructor(catName, isCute) {
        super(isCute);
        this.catName = catName;
        this.isCute = isCute;
    }
    name() {
        return this.catName;
    }
}
// Class 'Dog', inheriting from 'abstractPet'.
class Dog extends abstractPet {
    constructor(dogName, bittenCats) {
        super(bittenCats);
        this.dogName = dogName;
        this.bittenCats = bittenCats;
    }
    name() {
        return this.dogName;
    }
}
// A function to create a welcome message based on a 'pet' object that implements the 'Pet' interface.
function hey_1(pet) {
    return "hey! i'm " + pet.name();
}
let a = new Cat("myavchik", true);
let b = new Dog("gavchik", 333);
hey_1(a);
hey_1(b);
// 4.3 A function to create a welcome message based on some object 'a'.
function hey_2(a) {
    return ("hey! i'm " +
        a.name() +
        (a.type === "cat" ? "cuteness: " + a.cuteness : "coolness: " + a.coolness));
}
hey_2({ name: () => "roma", type: "cat", cuteness: 100 });
hey_2({ name: () => "vasya", type: "dog", coolness: 100 });
// 5. A function for getting records from an object of type 'Record<string, any>'.
// google for Record type
function stringEntries(a) {
    return Array.isArray(a) ? a : Object.keys(a);
}
// 6.
// you don't know Promises and async/await yet. Or do you?
// ....can be hard, don't worry and SKIP if you do not know how to do it
// async function world(a) {
//   return "*".repeat(a);
// }
// const hello = async () => {
//   return await world(10);
// };
// hello()
//   .then((r) => console.log(r))
//   .catch((e) => console.log("fail"));
console.log("Hmm...Great!.. Everything worked out here!...");
