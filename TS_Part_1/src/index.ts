console.log("Hello!!! I'll try to compile this...");

// 1. Function to get the length of the first word from a string.

function getFirstWord(a: string) {
  return a.split(/ +/)[0].length;
}

// 2. Function for obtaining information about the user using his first and last name.

function getUserNamings(a: { name: string; surname: string }) {
  return {
    fullname: a.name + " " + a.surname,
    initials: a.name[0] + "." + a.surname[0],
  };
}

// 3. Function to get all product names from an array of product objects.

// <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining>
function getAllProductNames(a: { products?: { name: string }[] }) {
  return a?.products?.map((prod: { name: string }) => prod?.name) || [];
}

// 4.1 A function to create a welcome message based on some object 'a'.

// easy way is using 'as' keyword
// hard way is ?...
function hey(a: { name(): string; [anyKey: string]: any }) {
  return "hey! i'm " + a.name();
}
hey({ name: () => "roma", cuteness: 100 });
hey({ name: () => "vasya", coolness: 100 });

// 4.2 

// Interface for objects with 'name' method and 'anyKey' properties.
interface Pet {
  name(): string;
  anyKey: boolean | number;
}

// Abstract class 'abstractPet' implementing the 'Pet' interface.
abstract class abstractPet implements Pet {
  constructor(public anyKey: boolean | number) {}

  abstract name(): string;
}

// Class 'Cat', inheriting from 'abstractPet'.
class Cat extends abstractPet {
  constructor(private catName: string, private isCute: boolean) {
    super(isCute);
  }

  name(): string {
    return this.catName;
  }
}

// Class 'Dog', inheriting from 'abstractPet'.
class Dog extends abstractPet {
  constructor(private dogName: string, private bittenCats: number) {
    super(bittenCats);
  }

  name(): string {
    return this.dogName;
  }
}

// A function to create a welcome message based on a 'pet' object that implements the 'Pet' interface.
function hey_1(pet: Pet) {
  return "hey! i'm " + pet.name();
}

let a = new Cat("myavchik", true);
let b = new Dog("gavchik", 333);
hey_1(a);
hey_1(b);

// 4.3 A function to create a welcome message based on some object 'a'.

function hey_2(a: { name(): string; type: string; [anyKey: string]: any }) {
  return (
    "hey! i'm " +
    a.name() +
    (a.type === "cat" ? "cuteness: " + a.cuteness : "coolness: " + a.coolness)
  );
}
hey_2({ name: () => "roma", type: "cat", cuteness: 100 });
hey_2({ name: () => "vasya", type: "dog", coolness: 100 });

// 5. A function for getting records from an object of type 'Record<string, any>'.

// google for Record type
function stringEntries(a: Record<string, any>) {
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
