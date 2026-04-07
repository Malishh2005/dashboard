import TaskManager from './TaskManager.js';

 const authScreen = document.querySelector('#auth-screen');
 const appScreen = document.querySelector('#app-screen');
 const logForm = document.querySelector('#login-form');
 const usernameInput = document.querySelector('#username-input');
 const blockLogError = document.querySelector('#login-error');
 const welcomeMsg = document.querySelector('#welcome-msg');
 const logoutBtn = document.querySelector('#logout-btn');
 const quoteText = document.querySelector('#quote-text');

 const taskForm = document.querySelector('#task-form');
 const taskInput = document.querySelector('#new-task-input');
 const taskList = document.querySelector('#task-list');

 // check empty(need to do) or corrupted data(done) in localStorage

 const myManager = new TaskManager();

 function toggleScreen(isLoggedIn, username){
   if(isLoggedIn){
      authScreen.classList.add('hidden');
      appScreen.classList.remove('hidden');
      welcomeMsg.textContent = `Welcome, ${username}!`;
      fetchQuote();
   } else {
      authScreen.classList.remove('hidden');
      appScreen.classList.add('hidden');
   }
 };

 function renderTasks(taskManager){
   const tasks = taskManager.getAllTasks();
   taskList.innerHTML = ''; // Очищаємо список перед рендером
   tasks.forEach(task => {
      // Як це виглядає через мій метод (швидко і читабельно):
      const htmlString = `
         <li class="task-item ${task.isCompleted ? 'completed' : ''}" data-id="${task.id}">
            <label class="task-content">
                  <input type="checkbox" ${task.isCompleted ? 'checked' : ''}>
                  <span>${task.title}</span>
            </label>
            <button class="btn btn-danger delete-btn">Видалити</button>
         </li>
      `;
      taskList.insertAdjacentHTML('beforeend', htmlString);
   });
}

async function fetchQuote(){
   try{
      const response = await fetch('https://dummyjson.com/quotes/random');
      if (!response.ok) throw new Error("Помилка завантаження");
      const data = await response.json();
      quoteText.textContent = `"${data.quote}" - ${data.author}`;
   } catch (error){
      console.error('Error fetching quote:', error);
      quoteText.textContent ="now is not the best time for quotes, try again later!";
   }
}

 logForm.addEventListener('submit', (e) => {
   e.preventDefault();
   const username = usernameInput.value;
   if(usernameInput.value.includes(' ')){
      blockLogError.textContent = 'Username should not contain spaces!';
      blockLogError.style.display = 'block';
      return; 
     } else {
      blockLogError.style.display = 'none';
      localStorage.setItem('smartDaschboardUser', JSON.stringify(username));
      toggleScreen(true, username);
     }
   });

taskForm.addEventListener('submit', (e) => {
   e.preventDefault();
   const taskName = taskInput.value.trim();
   if(taskName){
      myManager.addTask(taskName);
      renderTasks(myManager);
      taskForm.reset();
   }  
});

taskList.addEventListener('click', (e) => {
   const taskItem = e.target.closest('.task-item');
   if(!taskItem) return; // Якщо клік не по завданню, ігноруємо
   if(e.target.classList.contains('delete-btn')){
      const taskId = Number(taskItem.dataset.id);
      myManager.deleteTask(taskId);
      renderTasks(myManager);
   } else if(e.target.type === 'checkbox'){
      const taskId = Number(taskItem.dataset.id);
      myManager.toggleTask(taskId);
      renderTasks(myManager);
   }
});

logoutBtn.addEventListener('click', () => {
   localStorage.removeItem('smartDaschboardUser');
   myManager.deleteAllTask();
   renderTasks(myManager);
   logForm.reset();
   toggleScreen(false);
});

const checkUser = localStorage.getItem('smartDaschboardUser');

if(checkUser){
   try{
      const username = JSON.parse(checkUser);
      if(typeof username === 'string' && username.trim() !== ''){
         toggleScreen(true, username);
      } else {
         localStorage.removeItem('smartDaschboardUser');
         toggleScreen(false);
      }
   } catch (error){
      console.error('Error parsing user data:', error);
      localStorage.removeItem('smartDaschboardUser');
      toggleScreen(false);
   }
}

// Одразу малюємо завдання (навіть якщо це порожній масив)
renderTasks(myManager);

