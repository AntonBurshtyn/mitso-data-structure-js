const { NotImplementedError } = require("../extensions/index.js");

module.exports = class BloomFilter {
  /**
   * @param {number} size - the size of the storage.
   * @param {number} hashCount - the number of hash functions.
   */
  constructor(size = 100, hashCount = 3) {
    this.size = size; // Размер битового массива
    this.hashCount = hashCount; // Количество хэш-функций
    this.store = this.createStore(size); // Создание битового массива
  }

  /**
   * Создаёт хранилище данных в виде битового массива.
   * @param {number} size
   * @return {Uint8Array}
   */
  createStore(size) {
    return new Uint8Array(size); // Создаём массив, где все значения изначально равны 0
  }

  /**
   * Хэш-функция.
   * Генерирует хэш-значение для строки, используя заданное `seed`.
   * @param {string} item
   * @param {number} seed
   * @return {number}
   */
  hash(item, seed) {
    let hash = 0;
    for (let i = 0; i < item.length; i++) {
      hash = (hash * seed + item.charCodeAt(i)) % this.size;
    }
    return hash;
  }

  /**
   * Генерирует массив хэш-значений для заданной строки.
   * @param {string} item
   * @return {number[]}
   */
  getHashValues(item) {
    const hashValues = [];
    for (let i = 1; i <= this.hashCount; i++) {
      hashValues.push(this.hash(item, i));
    }
    return hashValues;
  }

  /**
   * Добавляет элемент в фильтр Блума.
   * @param {string} item
   */
  insert(item) {
    const hashValues = this.getHashValues(item);
    hashValues.forEach((hash) => {
      this.store[hash] = 1; // Устанавливаем биты в массиве
    });
  }

  /**
   * Проверяет, может ли элемент принадлежать множеству.
   * @param {string} item
   * @return {boolean}
   */
  mayContain(item) {
    const hashValues = this.getHashValues(item);
    return hashValues.every((hash) => this.store[hash] === 1);
  }
};
