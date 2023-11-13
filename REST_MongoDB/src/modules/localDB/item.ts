/*
 User task interface module.
*/

// Array element interface with 'id', 'text' and 'checked' fields.
export interface Item {
  id: number;
  text: string;
  checked: boolean;
}

// Creating an array of elements.
export const items: Item[] = [];
