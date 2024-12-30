// Get elements by their IDs and store them in constants for easier access
const bar = document.getElementById("bar");
const cross = document.getElementById("cross");
const activeBar = document.getElementById("active-bar");
const newCard = document.getElementById("new-card");
const changeTheme = document.getElementById("change-theme");

// Event listener for the 'bar' element click event
bar.addEventListener("click", function () {
    // Hide the bar and show the cross and active bar
    bar.style.display = 'none';
    cross.style.display = 'block';
    activeBar.style.display = 'block';
});

// Event listener for the 'cross' element click event
cross.addEventListener("click", function () {
    // Show the bar and hide the cross and active bar
    bar.style.display = 'block';
    cross.style.display = 'none';
    activeBar.style.display = 'none';
});

// Event listener for the 'newCard' element click event
newCard.addEventListener("click", function () {
    // Show the bar and hide the cross and active bar
    bar.style.display = 'block';
    cross.style.display = 'none';
    activeBar.style.display = 'none';

    // Generate unique IDs for the new card and its task container and input
    const cardId = 'card-' + new Date().getTime();
    const taskContainerId = 'task-container-' + new Date().getTime();
    const inputId = 'input-' + new Date().getTime();

    // Create a new card element with the generated IDs
    let newCardElement = document.createElement('div');
    newCardElement.className = 'column';
    newCardElement.id = cardId;
    newCardElement.innerHTML = `<h2>New Card<span><i class="fa-solid fa-trash delete-new-card"></i></span></h2>
    <div class="task-container" id="${taskContainerId}"></div>
    <input type="text" placeholder="New task" id="${inputId}">
    <button onclick="addTask('${taskContainerId}', '${inputId}')">Add Task</button>`;

    // Append the new card to the board
    document.getElementsByClassName('board')[0].appendChild(newCardElement);

    // Add drag-and-drop event listeners to the new task container
    const newTaskContainer = document.getElementById(taskContainerId);
    newTaskContainer.addEventListener('dragover', event => {
        event.preventDefault();
    });

    newTaskContainer.addEventListener('drop', event => {
        event.preventDefault();
        const id = event.dataTransfer.getData('text');
        const draggable = document.getElementById(id);
        if (draggable) {
            newTaskContainer.appendChild(draggable);
            saveTasksToLocalStorage();
        }
    });

    // Add event listener to delete the card when the delete button is clicked
    const deleteButton = newCardElement.querySelector('.delete-new-card');
    deleteButton.addEventListener('click', function () {
        newCardElement.remove();
        saveTasksToLocalStorage();
    });

    // Save the new card to local storage
    saveTasksToLocalStorage();
});

// Event listener for the 'changeTheme' element click event
changeTheme.addEventListener("click", function () {
    // Show the bar and hide the cross and active bar
    bar.style.display = 'block';
    cross.style.display = 'none';
    activeBar.style.display = 'none';

    // Get the current background color and toggle it between light and dark
    const currentBgColor = window.getComputedStyle(document.body).backgroundColor;

    if (currentBgColor === "rgb(244, 244, 244)") {
        document.body.style.backgroundColor = "black";
    } else {
        document.body.style.backgroundColor = "#f4f4f4";
    }

    // Save the background color change to local storage
    saveTasksToLocalStorage();
});

// Variable to keep track of the current task being edited
let currentTask = null;

// Function to save tasks and card states to local storage
function saveTasksToLocalStorage() {
    const cards = [];
    // Gather all card elements and their inner HTML content
    document.querySelectorAll('.column').forEach(card => {
        cards.push({
            id: card.id,
            html: card.innerHTML
        });
    });

    // Save the cards and background color to local storage
    const tasks = {
        cards: cards,
        bgColor: window.getComputedStyle(document.body).backgroundColor
    };
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to load tasks and card states from local storage
function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    if (tasks) {
        // Restore the background color
        document.body.style.backgroundColor = tasks.bgColor;

        // Clear the board before loading saved cards
        const board = document.getElementsByClassName('board')[0];
        board.innerHTML = '';

        // Restore each card and its event listeners
        tasks.cards.forEach(card => {
            let newCardElement = document.createElement('div');
            newCardElement.className = 'column';
            newCardElement.id = card.id;
            newCardElement.innerHTML = card.html;
            board.appendChild(newCardElement);

            const newTaskContainer = newCardElement.querySelector('.task-container');
            newTaskContainer.addEventListener('dragover', event => {
                event.preventDefault();
            });

            newTaskContainer.addEventListener('drop', event => {
                event.preventDefault();
                const id = event.dataTransfer.getData('text');
                const draggable = document.getElementById(id);
                if (draggable) {
                    newTaskContainer.appendChild(draggable);
                    saveTasksToLocalStorage();
                }
            });

            // Re-attach event listeners to tasks within this card
            newCardElement.querySelectorAll('.task').forEach(task => {
                task.addEventListener('dragstart', dragStart);
                task.addEventListener('dragend', dragEnd);
            });
        });
    }
}

// Function to add a task to a specific column
function addTask(columnId, inputId) {
    const column = document.getElementById(columnId);
    const input = document.getElementById(inputId);
    const taskText = input.value.trim();

    if (taskText) {
        const task = createTaskElement(taskText);
        column.appendChild(task);
        input.value = '';
        saveTasksToLocalStorage();
    }
}

// Function to create a task element
function createTaskElement(taskText) {
    const task = document.createElement('div');
    task.className = 'task';
    task.draggable = true;
    task.id = 'task-' + new Date().getTime();
    task.innerHTML = `${taskText} <span class="edit" onclick="editTask(this)"><i class="fa-solid fa-pen-to-square"></i></span> <span class="delete" onclick="deleteTask(this)"><i class="fa-solid fa-trash"></i></span>`;

    // Add drag-and-drop event listeners to the task
    task.addEventListener('dragstart', dragStart);
    task.addEventListener('dragend', dragEnd);
    return task;
}

// Function to edit a task
function editTask(element) {
    currentTask = element.parentElement;
    const taskText = currentTask.textContent.trim().replace('EditDelete', '');
    document.getElementById('edit-task-input').value = taskText;
    document.getElementById('edit-modal').style.display = 'flex';
}

// Function to save the edited task
function saveTask() {
    if (currentTask) {
        const newTaskText = document.getElementById('edit-task-input').value.trim();
        currentTask.innerHTML = `${newTaskText}<span class="edit" onclick="editTask(this)"><i class="fa-solid fa-pen-to-square"></i></span> <span class="delete" onclick="deleteTask(this)"><i class="fa-solid fa-trash"></i></span>`;
        document.getElementById('edit-modal').style.display = 'none';
        saveTasksToLocalStorage();
    }
}

// Function to close the edit modal
function closeModal() {
    document.getElementById('edit-modal').style.display = 'none';
}

// Function to delete a task
function deleteTask(element) {
    const task = element.parentElement;
    task.remove();
    saveTasksToLocalStorage();
}

// Function to handle drag start event
function dragStart(event) {
    event.dataTransfer.setData('text', event.target.id);
    setTimeout(() => {
        event.target.classList.add('hide');
    }, 0);
}

// Function to handle drag end event
function dragEnd(event) {
    event.target.classList.remove('hide');
    saveTasksToLocalStorage();
}

// Add drag-and-drop event listeners to all task containers
document.querySelectorAll('.task-container').forEach(container => {
    container.addEventListener('dragover', event => {
        event.preventDefault();
    });

    container.addEventListener('drop', event => {
        event.preventDefault();
        const id = event.dataTransfer.getData('text');
        const draggable = document.getElementById(id);
        if (draggable) {
            container.appendChild(draggable);
            saveTasksToLocalStorage();
        }
    });
});

// Load tasks from local storage when the window loads
window.onload = loadTasksFromLocalStorage;
