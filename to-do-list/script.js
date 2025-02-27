document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");
    const completedTasks = document.getElementById("completedTasks");
    const clearAllBtn = document.getElementById("clearAllBtn");
    const totalTasks = document.getElementById("totalTasks");
    const completedCount = document.getElementById("completedCount");
    const pendingCount = document.getElementById("pendingCount");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    function updateSummary() {
        totalTasks.textContent = tasks.length;
        completedCount.textContent = tasks.filter(task => task.completed).length;
        pendingCount.textContent = tasks.filter(task => !task.completed).length;
    }

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function renderTasks() {
        taskList.innerHTML = "";
        completedTasks.innerHTML = "";

        const fragmentPending = document.createDocumentFragment();
        const fragmentCompleted = document.createDocumentFragment();

        tasks.forEach((task, index) => {
            const li = document.createElement("li");
            li.innerHTML = `<span>${task.text} (Priority: ${task.priority}, Due: ${task.dueDate})</span>`;

            const completeBtn = document.createElement("button");
            completeBtn.textContent = task.completed ? "Undo" : "Complete";
            completeBtn.classList.add("task-btn");
            completeBtn.addEventListener("click", () => {
                tasks[index].completed = !tasks[index].completed;
                saveTasks();
                renderTasks();
                updateSummary();
            });

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.classList.add("delete-btn");
            deleteBtn.addEventListener("click", () => {
                tasks = tasks.filter((_, i) => i !== index);
                saveTasks();
                renderTasks();
                updateSummary();
            });

            li.appendChild(completeBtn);
            li.appendChild(deleteBtn);

            if (task.completed) {
                li.classList.add("completed");
                fragmentCompleted.appendChild(li);
            } else {
                fragmentPending.appendChild(li);
            }
        });

        taskList.appendChild(fragmentPending);
        completedTasks.appendChild(fragmentCompleted);
    }

    addTaskBtn.addEventListener("click", () => {
        if (taskInput.value.trim() === "") {
            alert("Task input cannot be empty!");
            return;
        }

        const newTask = {
            text: taskInput.value,
            priority: document.getElementById("priority").value,
            dueDate: document.getElementById("dueDate").value,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        taskInput.value = "";
        renderTasks();
        updateSummary();
    });

    clearAllBtn.addEventListener("click", () => {
        tasks = [];
        saveTasks();
        renderTasks();
        updateSummary();
    });

    updateSummary();
    renderTasks();
});
