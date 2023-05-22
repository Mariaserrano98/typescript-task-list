import { Fetch } from "./Fetch.js";

export class App { //exporta la clase App para que pueda ser importada desde otro fichero JS
  constructor() { //constructor de la clase App que inicializa las propiedades de la clase App ,  reserva espacio en memoria
    this.alert = document.querySelector(".alert"); //propiedad alert que hace referencia al elemento HTML con la clase alert 
    this.close = this.alert.firstElementChild; //propiedad close que hace referencia al primer elemento hijo del elemento HTML con la clase alert 
    this.input = document.querySelector("input"); //propiedad input que hace referencia al elemento HTML input 
    this.arrow = document.querySelector(".arrow"); //propiedad arrow que hace referencia al elemento HTML con la clase arrow 
    this.table = document.querySelector("tbody"); //propiedad table que hace referencia al elemento HTML tbody 
    // this.alert lo que hace es seleccionar el elemento HTML con la clase alert y lo guarda en la propiedad alert de la clase App
  }
  init = async () => { //método init que inicializa la aplicación , async indica que el método init es asíncrono
    //eventos
    //Cerrar la alerta en el botón con la X
    this.close.addEventListener("click", () => { //evento que se ejecuta cuando se hace click en el elemento HTML con la clase close 
      this.alert.classList.add("dismissible"); //añade la clase dismissible al elemento HTML con la clase alert 
    });
    //Impedir la recarga de la página y añadir una nueva tarea
    this.input.addEventListener("keydown", (e) => { //evento que se ejecuta cuando se pulsa una tecla en el elemento HTML input 
      if (e.code == "Enter" || e.code == "NumpadEnter") { //si la tecla pulsada es Enter o NumpadEnter 
        e.preventDefault(); //impide la recarga de la página 
        addTask(input, id, text, alert); //añade una nueva tarea 
      }
    });
    this.input.addEventListener("input", (e) => { //evento que se ejecuta cuando se introduce un valor en el elemento HTML input  
      if (this.input.value !== "" && !this.alert.classList.contains("dismissible")) {  //si el valor del elemento HTML input es distinto de vacío y el elemento HTML con la clase alert no contiene la clase dismissible 
        this.alert.classList.add("dismissible"); //añade la clase dismissible al elemento HTML con la clase alert 
      }
    });
    //Añadir una nueva tarea
    this.arrow.addEventListener("click", () => { //evento que se ejecuta cuando se hace click en el elemento HTML con la clase arrow 
      this.addTask(this.input, this.idGenerator(), this.input.value, this.alert); //añade una nueva tarea 
    }); 
    // Fetch all tasks
    let tasks = await Fetch.getAll(); //obtiene todas las tareas  para el codigo hasta que no se resuelva la promesa no continua
    // Render all tasks
    this.renderTasks(tasks); //renderiza todas las tareas
  };
  // //prepara una plantilla HTML, y la actualiza con contenido dinámico
  generateRow = (id, title, done) => { //método generateRow que recibe como parámetros el id, el título y el estado de la tarea
    let newRow = document.createElement("tr"); //crea un elemento HTML tr y lo guarda en la variable newRow 
    newRow.setAttribute("id", id); //añade un atributo id al elemento HTML tr con el valor del parámetro id 
    title = done ? `<del>${title}</del>` : title; //si el parámetro done es true añade el título tachado 
    newRow.innerHTML = ` 
<td>
  <i class="fa-solid fa-circle-check"></i>
  <span contenteditable="true" class="task">${title}</span>
</td>
<td>
  <span class="fa-stack fa-2x">
    <i class="fa-solid fa-square fa-stack-2x"></i>
    <i class="fa-solid fa-stack-1x fa-pencil fa-inverse"></i>
  </span>
</td>
<td>
  <span class="fa-stack fa-2x">
    <i class="fa-solid fa-square fa-stack-2x"></i>
    <i class="fa-solid fa-stack-1x fa-trash fa-inverse"></i>
  </span>
</td>
  `;
    //Tachar una tarea realizada
    newRow.firstElementChild.firstElementChild.addEventListener( //evento que se ejecuta cuando se hace click en el primer elemento hijo del elemento HTML tr 
      "click",
      (e) => {
        this.crossOut(e); //tacha la tarea 
      }
    );
    //Activar el modo edición desde la tarea
    newRow.firstElementChild.lastElementChild.addEventListener("focus", (e) => { //evento que se ejecuta cuando el elemento HTML con la clase task obtiene el foco 
      this.editModeOn(e, true); //activa el modo edición 
    });
    //Desactivar el modo edición
    newRow.firstElementChild.lastElementChild.addEventListener("blur", (e) => { //evento que se ejecuta cuando el elemento HTML con la clase task pierde el foco 
      this.editModeOff(e);  //desactiva el modo edición
    });
    //Activar el modo edición desde el icono
    newRow.firstElementChild.nextElementSibling.firstElementChild.lastElementChild.addEventListener( //evento que se ejecuta cuando se hace click en el último elemento hijo del elemento HTML con la clase fa-pencil 
      "click",
      (e) => {
        this.editModeOn(e, false); //activa el modo edición 
      }
    );
    //Eliminar la fila  
    newRow.lastElementChild.firstElementChild.lastElementChild.addEventListener( //evento que se ejecuta cuando se hace click en el último elemento hijo del elemento HTML con la clase fa-trash 
      "click",
      (e) => {
        this.removeRow(e, false); //elimina la fila
      }
    );
    return newRow; //devuelve el elemento HTML tr
  };
  renderTasks = (tasks) => { //método renderTasks que recibe como parámetro un array de tareas 
    console.log(tasks.length); //muestra en la consola la longitud del array de tareas 
    tasks.forEach((task) => { //recorre el array de tareas 
      this.table.appendChild(this.generateRow(task.id, task.title, task.done)); //añade al elemento HTML table una fila por cada tarea 
    });
  };
  // //Tachado de tarea
  crossOut = (e) => { //método crossOut que recibe como parámetro el evento 
    let task = e.target.nextElementSibling; //guarda en la variable task el elemento HTML hermano del elemento HTML que ha disparado el evento 
    let text = task.innerHTML; //guarda en la variable text el contenido del elemento HTML task 
    if (text.includes("<del>")) { //si el contenido del elemento HTML task contiene la etiqueta del  
      text = task.firstElementChild.textContent; //guarda en la variable text el contenido del primer elemento hijo del elemento HTML task 
      task.innerHTML = text; //añade al elemento HTML task el contenido de la variable text 
      task.parentNode.parentNode.setAttribute("data-completed", "false"); //añade al elemento HTML padre del elemento HTML task un atributo data-completed con el valor false  
    } else { //si el contenido del elemento HTML task no contiene la etiqueta del 
      task.innerHTML = `<del>${text}</del>`; //añade al elemento HTML task el contenido de la variable text tachado 
      task.parentNode.parentNode.setAttribute("data-completed", "true"); //añade al elemento HTML padre del elemento HTML task un atributo data-completed con el valor true 
    }
  };
  //Añadir nueva tarea
  addTask = (input, id, text, alert) => { //método addTask que recibe como parámetros el elemento HTML input, el id, el texto y el elemento HTML alert 
    if (input.value.trim() === "") { //si el contenido del elemento HTML input contiene solo espacios en blanco 
      input.value = ""; //vacía el contenido del elemento HTML input 
      alert.classList.remove("dismissible"); //elimina la clase dismissible del elemento HTML alert 
    } else { //si el contenido del elemento HTML input no contiene solo espacios en blanco 
      text = input.value; //guarda en la variable text el contenido del elemento HTML input 
      id = 
        parseInt(
          document.querySelector("tbody")?.lastElementChild?.getAttribute("id") //guarda en la variable id el valor del atributo id del último elemento hijo del elemento HTML tbody 
        ) + 1 || 0;
      document.querySelector("tbody").appendChild(this.generateRow(id, text)); //añade al elemento HTML tbody una fila con el id y el texto 
      input.value = ""; //vacía el contenido del elemento HTML input
    }
  };
  //Modo Edición
  editModeOn = (e, onFocus) => { //método editModeOn que recibe como parámetros el evento y un booleano onFocus 
    let task; //declara la variable task 
    if (onFocus) { //si onFocus es true 
      task = e.currentTarget; //guarda en la variable task el elemento HTML que ha disparado el evento
    } else {  //si onFocus es false
      task =
        e.currentTarget.parentNode.parentNode.previousElementSibling
          .lastElementChild;  //guarda en la variable task el elemento HTML hermano del elemento HTML padre del elemento HTML que ha disparado el evento 
      task.focus(); //añade el foco al elemento HTML task 
    }
    // console.log(task);
    task.classList.add("editable"); //añade la clase editable al elemento HTML task 
    document.addEventListener("keydown", (e) => { //evento que se ejecuta cuando se pulsa una tecla 
      if (e.code == "Enter" || e.code == "NumpadEnter" || e.code == "Escape") { //si la tecla pulsada es Enter o Escape 
        task.blur(); //elimina el foco del elemento HTML task 
      }
    });
  };
  editModeOff = (e) => { //método editModeOff que recibe como parámetro el evento 
    let task = e.currentTarget; //guarda en la variable task el elemento HTML que ha disparado el evento
    if (task.innerHTML === "") { //si el contenido del elemento HTML task está vacío 
      this.removeRow(e, true); //elimina la fila 
    } else { //si el contenido del elemento HTML task no está vacío 
      task.classList.remove("editable"); //elimina la clase editable del elemento HTML task 
      task.innerHTML = this.clearWhitespaces(task.innerHTML); //añade al elemento HTML task el contenido del elemento HTML task sin espacios en blanco 
      if (task.innerHTML === "") { //si el contenido del elemento HTML task está vacío 
        this.removeRow(e, true); //elimina la fila 
      }
    }
  };
  //Eliminación de tarea
  removeRow = (e, editionMode) => { //método removeRow que recibe como parámetros el evento y un booleano editionMode 
    if (editionMode) { //si editionMode es true 
      e.target.parentNode.parentNode.remove(); //elimina el elemento HTML padre del elemento HTML que ha disparado el evento 
    } else { //si editionMode es false 
      // console.log(e.target.parentNode.parentNode.parentNode);
      e.target.parentNode.parentNode.parentNode.remove(); //elimina el elemento HTML padre del elemento HTML padre del elemento HTML que ha disparado el evento 
    }
  };
  //Eliminación de espacios en blanco
  clearWhitespaces = (text) => { //método clearWhitespaces que recibe como parámetro el texto
    return text.replace(new RegExp(/&nbsp;/, "g"), "").trim(); 
  };
  idGenerator = () => { //método idGenerator 
   // generate random hex string 
    return Math.floor(Math.random() * 16777215).toString(16); //devuelve un número aleatorio hexadecimal 
  }
}
