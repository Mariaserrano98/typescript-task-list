import fs from 'fs';
import { faker } from '@faker-js/faker';
import crypto from 'crypto';

// Función para generar un ID único en forma de cadena hexadecimal
function generateId() {
  return crypto.randomBytes(8).toString('hex');
}

// Generamos una lista de 10 tareas con títulos aleatorios y estado alternando aleatoriamente entre true y false
// En caso de querer un array
const taskList = {
  tasks: Array.from({ length: 10 }, (_, index) => ({
    id: generateId(),
    title: faker.lorem.words(3),
    isDone: index % 2 === 0
  }))
};


// En caso de querer un objeto
// const tasks = Array.from({ length: 10 }, (_, index) => ({
//   id: generateId(),
//   title: faker.lorem.words(3),
//   isDone: index % 2 === 0
// })).reduce((acc, task) => {
//   acc[task.id] = task;
//   return acc;
// }, {});


// Guardamos la lista de tareas en un archivo JSON
fs.writeFileSync('db.json', JSON.stringify(taskList, null, 2));

console.log('Done!.');

