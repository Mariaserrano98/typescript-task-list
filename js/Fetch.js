export class Fetch {  // Clase Fetch con métodos estáticos para realizar las peticiones al servidor
  BASE_URL = "http://localhost:8000/tasks"; // URL base del servidor
  static async getAll() { // Método para obtener todas las tareas 
    const response = await fetch("http://localhost:8000/tasks"); // fetch devuelve una promesa que se resuelve cuando se obtiene la respuesta del servidor (response)
    if (!response.ok) {                                    // Si la respuesta no es correcta, se lanza un error con el mensaje de error correspondiente (statusText) y el código de error (status) 
      throw new Error(
        `Error al obtener las tareas: ${response.status} ${response.statusText}` // statusText: mensaje de error del servidor
      );
    }
    const data = await response.json(); // Si la respuesta es correcta, se obtiene la respuesta en formato JSON y se devuelve (data) 
    return data;                       // Se devuelve la respuesta en formato JSON
  }

  static async create(task) {  // Método para crear una tarea 
    const response = await fetch(this.BASE_URL, { // Se realiza una petición POST a la URL base del servidor (BASE_URL) con el objeto task en formato JSON en el cuerpo de la petición (body) 
      method: "POST",                            // El método de la petición es POST
      headers: {                                // Se especifica el tipo de contenido del cuerpo de la petición (Content-Type) 
        "Content-Type": "application/json",  // El tipo de contenido es JSON 
      },
      body: JSON.stringify(task),          // El cuerpo de la petición es el objeto task en formato JSON 
    });
    if (!response.ok) {                   // Si la respuesta no es correcta, se lanza un error con el mensaje de error correspondiente (statusText) y el código de error (status) 
      throw new Error(                  // statusText: mensaje de error del servidor 
        `Error al crear la tarea: ${response.status} ${response.statusText}` // status: código de error del servidor 
      );
    }
    const data = await response.json(); // Si la respuesta es correcta, se obtiene la respuesta en formato JSON y se devuelve (data) 
    return data;                      // Se devuelve la respuesta en formato JSON
  }

  static async update(task) { // Método para actualizar una tarea 
    const response = await fetch(`${this.BASE_URL}${task.id}`, { // Se realiza una petición PATCH a la URL base del servidor (BASE_URL) con el id de la tarea a actualizar en la URL y el objeto task en formato JSON en el cuerpo de la petición (body)
      method: "PATCH",                                           // El método de la petición es PATCH
      headers: {                                             // Se especifica el tipo de contenido del cuerpo de la petición (Content-Type) 
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task), // El cuerpo de la petición es el objeto task en formato JSON  stringify(): convierte un objeto o valor de JavaScript en una cadena de texto JSON
    });
    if (!response.ok) {       // Si la respuesta no es correcta, se lanza un error con el mensaje de error correspondiente (statusText) y el código de error (status) 
      throw new Error(    // statusText: mensaje de error del servidor 
        `Error al actualizar la tarea: ${response.status} ${response.statusText}` // status: código de error del servidor 
      );
    }
    const data = await response.json(); // Si la respuesta es correcta, se obtiene la respuesta en formato JSON y se devuelve (data) 
    return data;                     // Se devuelve la respuesta en formato JSON
  }

  static async delete(id) { // Método para eliminar una tarea 
    const response = await fetch(`${this.BASE_URL}${id}`, { // Se realiza una petición DELETE a la URL base del servidor (BASE_URL) con el id de la tarea a eliminar en la URL 
      method: "DELETE", // El método de la petición es DELETE 
    });
    if (!response.ok) {  // Si la respuesta no es correcta, se lanza un error con el mensaje de error correspondiente (statusText) y el código de error (status) 
      throw new Error( // statusText: mensaje de error del servidor 
        `Error al eliminar la tarea: ${response.status} ${response.statusText}` // status: código de error del servidor 
      );
    }
  }
}
