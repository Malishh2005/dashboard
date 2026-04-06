import Task from "./Task.js";

export default class TaskManager {
   #tasks; 

   constructor(){
      const savedTasks = localStorage.getItem('smartDashboardTasks');
      this.#tasks = savedTasks ? JSON.parse(savedTasks) : [];;
   };
   addTask(title){
      const newTask = new Task(title);
      this.#tasks.push(newTask);
      this.#savetoStorage();
   };
   getAllTasks(){
      return this.#tasks;
   };

   deleteTask(id){
      this.#tasks = this.#tasks.filter(task => task.id !== id);
      this.#savetoStorage();
   };

   deleteAllTask(){
      this.#tasks = [];
      this.#savetoStorage();
   };

   toggleTask(id){
      const task = this.#tasks.find(task => task.id === id);
      if(task) task.isCompleted = !task.isCompleted;
      this.#savetoStorage();
   };

   #savetoStorage(){
      // Тут ми б зберігали завдання в localStorage або на сервері
      localStorage.setItem('smartDashboardTasks', JSON.stringify(this.#tasks));
   };

}