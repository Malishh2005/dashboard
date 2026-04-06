export default class Task {
   constructor(title){
      this.title = title;
      this.id = Date.now();
      this.isCompleted = false;
   }
}
