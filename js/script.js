let todos = JSON.parse(localStorage.getItem("todos")) || [];

// 🔊 helper untuk play sound
function playSound(id) {
  const sound = document.getElementById(id);
  if (sound) {
    sound.currentTime = 0; // restart biar bisa spam klik
    sound.play();
  }
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function addTodo() {
  const task = document.getElementById("taskInput").value;
  const date = document.getElementById("dateInput").value;

  if (task.trim() === "") {
    alert("Task cannot be empty!");
    return;
  }

  todos.push({ task, date, done: false });
  saveTodos();
  playSound("sound-add"); // 🔊 sound Add
  document.getElementById("taskInput").value = "";
  document.getElementById("dateInput").value = "";
  renderTodos();
}

function renderTodos(list = todos) {
  const container = document.getElementById("todoList");
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = "<p>No tasks yet.</p>";
    return;
  }

  list.forEach((todo, index) => {
    const item = document.createElement("div");
    item.className = "todo-item";

    // Checkbox done
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    checkbox.onchange = () => toggleDone(index);

    // Text task
    const span = document.createElement("span");
    span.textContent = `${todo.task} (${todo.date || "No date"})`;
    if (todo.done) span.classList.add("done");

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "edit-btn";
    editBtn.onclick = () => editTodo(index);

    // Delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.className = "delete-btn";
    delBtn.onclick = () => deleteTodo(index);

    item.appendChild(checkbox);
    item.appendChild(span);
    item.appendChild(editBtn);
    item.appendChild(delBtn);
    container.appendChild(item);
  });
}

function toggleDone(index) {
  todos[index].done = !todos[index].done;
  saveTodos();
  playSound("sound-done"); // 🔊 sound done/undone
  renderTodos();
}

function deleteTodo(index) {
  todos.splice(index, 1);
  saveTodos();
  playSound("sound-delete"); // 🔊 sound delete
  renderTodos();
}

function editTodo(index) {
  const newTask = prompt("Edit task:", todos[index].task);
  if (newTask === null || newTask.trim() === "") return;

  const newDate = prompt("Edit date (YYYY-MM-DD):", todos[index].date);
  todos[index].task = newTask;
  todos[index].date = newDate;
  saveTodos();
  playSound("sound-edit"); // 🔊 sound edit
  renderTodos();
}

function filterTodos() {
  const keyword = document.getElementById("searchInput").value.toLowerCase();
  const date = document.getElementById("filterDate").value;

  const filtered = todos.filter(todo => {
    const matchKeyword = todo.task.toLowerCase().includes(keyword);
    const matchDate = date ? todo.date === date : true;
    return matchKeyword && matchDate;
  });

  renderTodos(filtered);
}

function resetFilter() {
  document.getElementById("searchInput").value = "";
  document.getElementById("filterDate").value = "";
  renderTodos();
}

function sortTodos(order) {
  todos.sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return order === "asc"
      ? new Date(a.date) - new Date(b.date)
      : new Date(b.date) - new Date(a.date);
  });
  saveTodos();
  renderTodos();
}

// render awal
renderTodos();
