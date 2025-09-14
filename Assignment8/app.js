
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('taskForm');
  const input = document.getElementById('taskInput');
  const list = document.getElementById('taskList');
  const clearCompletedBtn = document.getElementById('clearCompleted');
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    const left = document.createElement('div');
    left.className = 'd-flex align-items-center flex-grow-1 min-width-0';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'form-check-input me-2';
    checkbox.checked = task.completed;

    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = task.text;
    if (task.completed) span.classList.add('completed');

    left.appendChild(checkbox);
    left.appendChild(span);
    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'btn btn-sm btn-outline-secondary me-2';
    editBtn.type = 'button';
    editBtn.textContent = 'Edit';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-sm btn-outline-danger';
    deleteBtn.type = 'button';
    deleteBtn.textContent = 'Delete';

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(left);
    li.appendChild(actions);

    checkbox.addEventListener('change', () => {
      task.completed = checkbox.checked;
      if (task.completed) span.classList.add('completed');
      else span.classList.remove('completed');
      saveTasks();
    });
    deleteBtn.addEventListener('click', () => {
      if (!confirm('Delete this task?')) return;
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      li.remove();
    });

    editBtn.addEventListener('click', () => {
      if (editBtn.textContent === 'Edit') {
        span.contentEditable = 'true';
        span.focus();
        editBtn.textContent = 'Save';
        span.classList.add('border','rounded','p-1'); 
      } else {
        span.contentEditable = 'false';
        editBtn.textContent = 'Edit';
        span.classList.remove('border','rounded','p-1');
        task.text = span.textContent.trim();
        saveTasks();
      }
    });

    
    span.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        editBtn.click();
      }
    });

    
    span.addEventListener('dblclick', () => editBtn.click());

    return li;
  }

  
  function renderTasks() {
    list.innerHTML = '';
    tasks.forEach(task => {
      list.appendChild(createTaskElement(task));
    });
  }

  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return; 
    const task = { id: Date.now(), text: text, completed: false };
    tasks.unshift(task); 
    saveTasks();
    
    list.prepend(createTaskElement(task));
    form.reset();
    input.focus();
  });

  
  clearCompletedBtn.addEventListener('click', () => {
    if (!confirm('Remove all completed tasks?')) return;
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
  });

  
  renderTasks();
});
