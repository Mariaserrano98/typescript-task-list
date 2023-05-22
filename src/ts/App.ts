import { Fetch } from "./Fetch";
const fetch = new Fetch(); // Instancia de la clase Fetch para realizar las peticiones a la API REST 
export class App {      
  private alert:HTMLElement;        
  private close:HTMLElement;
  private input:HTMLInputElement;
  private arrow:HTMLElement;
  private table:HTMLTableElement;
  private id: number = 1;
  private text:string;
  constructor() {
    this.alert = document.querySelector(".alert") as HTMLElement;
    this.close = this.alert.firstElementChild as HTMLElement;
    this.input = document.querySelector("input") as HTMLInputElement;
    this.arrow = document.querySelector(".arrow") as HTMLElement;
    this.table = document.querySelector("table") as HTMLTableElement;
    this.text = this.input.value.trim();
  }
  init = async () => {
    //eventos
    //Cerrar la alerta en el botón con la X    
    this.close.addEventListener("click", () => {
      this.alert.classList.add("dismissible");
    });
    //Impedir la recarga de la página y añadir una nueva tarea
    this.input.addEventListener("keydown", (e) => {
      if (e.code == "Enter" || e.code == "NumpadEnter") {
        e.preventDefault();
       this.addTask(this.input, this.id, this.text, this.alert);
      }
    });
    this.input.addEventListener("input", (e) => {
      if (this.input.value !== "" && !this.alert.classList.contains("dismissible")) {
        this.alert.classList.add("dismissible");
      }
    });
    //Añadir una nueva tarea
    this.arrow.addEventListener("click", () => {
      this.addTask(this.input, (this.idGenerator(), 16 ),this.input.value, this.alert);
    });
    // Fetch all tasks
    let tasks = await Fetch.getAll();
    // Render all tasks
    this.renderTasks(tasks);
  };
  // //prepara una plantilla HTML, y la actualiza con contenido dinámico
 
  generateRow = (id: string, title: any, done: undefined) => {
    let newRow = document.createElement("tr");
    newRow.setAttribute("id", id);
    title = done ? `<del>${title}</del>` : title;
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
  
    newRow.firstElementChild?.firstElementChild?.addEventListener(
      "click",
      (e) => {
        this.crossOut(e);
      }      
    );
    //Activar el modo edición desde la tarea
    newRow.firstElementChild?.lastElementChild?.addEventListener("focus", (e) => {
      this.editModeOn(e, true);
    });
    //Desactivar el modo edición
    newRow.firstElementChild?.lastElementChild?.addEventListener("blur", (e) => {
      this.editModeOff(e);
    });
    //Activar el modo edición desde el icono
    newRow.firstElementChild?.nextElementSibling?.firstElementChild?.lastElementChild?.addEventListener(
      "click",
      (e) => {
        this.editModeOn(e, false);
      }
    );
    //Eliminar la fila
    newRow.lastElementChild?.firstElementChild?.lastElementChild?.addEventListener(
      "click",
      (e) => {
        this.removeRow(e, false);
      }
    );
    return newRow;
  };
  renderTasks = (tasks:any) => {
    console.log(tasks.length);
    tasks.forEach((task:any) => {
      this.table.appendChild(this.generateRow(task.id, task.title, task.done));
    });
  };
  // //Tachado de tarea
  crossOut = (e:any) => {
    let task = e.target.nextElementSibling;
    let text = task.innerHTML;
    if (text.includes("<del>")) {
      text = task.firstElementChild.textContent;
      task.innerHTML = text;
      task.parentNode.parentNode.setAttribute("data-completed", "false");
    } else {
      task.innerHTML = `<del>${text}</del>`;
      task.parentNode.parentNode.setAttribute("data-completed", "true");
    }        
  };
  //Añadir nueva tarea
  addTask = async (input:HTMLInputElement, id:Number, text:string, alert:HTMLElement) => {
    if (input.value.trim() === "") {
      input.value = "";
      alert.classList.remove("dismissible");
    } else {
      text = input.value;
      id =
        parseInt(
          document.querySelector("tbody")?.lastElementChild?.getAttribute("id") || "0"
        ) + 1 || 0;
      document.querySelector("tbody")?.appendChild(this.generateRow(id.toString(), text, undefined));
      input.value = "";
    }
  };
  //Modo Edición
  editModeOn = (e:Event , onFocus:boolean) => {
    let task:any;
    if (onFocus) {
      task = e.currentTarget;
    } else {
      task =
        (e.currentTarget as HTMLElement).parentNode?.parentNode?.previousSibling?.lastChild as HTMLElement;
         
      task.focus();
    }
    // console.log(task);
    task.classList.add("editable");
    document.addEventListener("keydown", (e) => {
      if (e.code == "Enter" || e.code == "NumpadEnter" || e.code == "Escape") {
        task.blur();
      }
    });
  };
  editModeOff = (e:any) => {
    let task = e.currentTarget;
    if (task.innerHTML === "") {
      this.removeRow(e, true);
    } else {
      task.classList.remove("editable");
      task.innerHTML = this.clearWhitespaces(task.innerHTML);
      if (task.innerHTML === "") {
        this.removeRow(e, true);
      }
    }
  };
  //Eliminación de tarea
  removeRow = (e:any, editionMode:any) => {
    e && e.target && (
      editionMode ? e.target.parentNode.parentNode.remove() :
      e.target.parentNode.parentNode.parentNode.remove()
      // console.log(e.target.parentNode.parentNode.parentNode);
    );
  };
  //Eliminación de espacios en blanco
  clearWhitespaces = (text:string) => {
    return text.replace(new RegExp(/&nbsp;/, "g"), "").trim();
  };
  idGenerator = () => {
   // generate random hex string
    return Math.floor(Math.random() * 16777215).toString(16);
  }
}