/*
 Модуль интерфейса задач пользователя.
*/

// Интерфейс элемента массива с полями id, text и checked.
export interface Item {
  id: number;
  text: string;
  checked: boolean;
}

// Создание массива элементов.
export const items: Item[] = [];
