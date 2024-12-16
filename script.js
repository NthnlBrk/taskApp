document.addEventListener('DOMContentLoaded', function () {
  const darkMode = localStorage.getItem('dark-mode');
  if (darkMode === 'enabled') {
    document.body.classList.add('dark-mode');
  }
  loadTasks();
  displayCurrentDate();

  setInterval(function () {
    saveTasks();
  }, 30000);
});

function displayCurrentDate() {
  const dateElement = document.getElementById('currentDate');
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  dateElement.textContent = formattedDate;
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const darkMode = document.body.classList.contains('dark-mode')
    ? 'enabled'
    : 'disabled';
  localStorage.setItem('dark-mode', darkMode);
}

let tasks = [];

function loadTasks() {
  const savedTasks = localStorage.getItem('tasks');
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    displayTasks();
  }
}

function displayTasks() {
  const taskList = document.getElementById('tasksContainer');
  taskList.innerHTML = '';

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];

    const taskItem = document.createElement('li');
    taskItem.classList.add('task-item');

    const taskTitle = document.createElement('h3');
    taskTitle.textContent = task.title;
    taskItem.appendChild(taskTitle);

    if (task.description) {
      const taskDescription = document.createElement('p');
      taskDescription.textContent = task.description;
      taskItem.appendChild(taskDescription);
    }

    const taskCheckbox = document.createElement('input');
    taskCheckbox.type = 'checkbox';
    taskCheckbox.checked = task.completed;
    taskCheckbox.addEventListener('change', function () {
      task.completed = taskCheckbox.checked;
      if (task.completed) {
        taskItem.style.textDecoration = 'line-through';
        taskItem.style.backgroundColor = '#d3ffd3';
      } else {
        taskItem.style.textDecoration = 'none';
        taskItem.style.backgroundColor = '';
      }
      saveTasks();
    });

    taskItem.appendChild(taskCheckbox);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function () {
      deleteTask(i);
    });
    taskItem.appendChild(deleteButton);

    taskList.appendChild(taskItem);
  }
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  displayTasks();
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

document.getElementById('taskForm').addEventListener('submit', (event) => {
  event.preventDefault();

  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const dueDate = document.getElementById('dueDate').value;

  if (title.trim() === '') {
    alert('Title is required.');
    return;
  }

  if (!title.match(/^[a-zA-Z0-9 ]*$/)) {
    alert('Title must only contain letters, numbers, and spaces.');
    return;
  }

  const newTask = {
    title: title,
    description: description,
    dueDate: dueDate,
    status: status,
    completed: false,
  };

  tasks.push(newTask);

  saveTasks();
  document.getElementById('taskForm').reset();
  console.log(tasks);
  displayTasks();
});
