function addTask(columnId, inputId) {
    const column = document.getElementById(columnId);
    const input = document.getElementById(inputId);
    const taskText = input.value.trim();
    if (taskText) {
        const task = createTaskElement(taskText);
        column.appendChild(task);
        input.value = '';
    }
}

function createTaskElement(taskText) {
    const task = document.createElement('div');
    task.className = 'task';
    task.draggable = true;
    task.id = 'task-' + new Date().getTime();
    task.innerHTML = `${taskText} <span class="edit" onclick="editTask(this)"><i class="fa-solid fa-pen-to-square"></i></span> <span class="delete" onclick="deleteTask(this)"><i class="fa-solid fa-trash"></i></span>`;

    task.addEventListener('dragstart', dragStart);
    task.addEventListener('dragend', dragEnd);
    return task;
}

function editTask(element) {
    currentTask = element.parentElement;
    const taskText = currentTask.textContent.trim().replace('EditDelete', '');
    document.getElementById('edit-task-input').value = taskText;
    document.getElementById('edit-modal').style.display = 'flex';
}

function saveTask(){
    if(currentTask){
        const newTaskText = document.getElementById('edit-task-input').value.trim();
        currentTask.innerHTML = `${newTaskText}<span class="edit" onclick="editTask(this)"><i class="fa-solid fa-pen-to-square"></i></span> <span class="delete" onclick="deleteTask(this)"><i class="fa-solid fa-trash"></i></span>`;
        document.getElementById('edit-modal').style.display = 'none';
    }
}

function closeModal() {
    document.getElementById('edit-modal').style.display = 'none';
}

function deleteTask(element) {
    const task = element.parentElement;
    task.remove();
}

function dragStart(event) {
    event.dataTransfer.setData('text', event.target.id);
    setTimeout(() => {
        event.target.classList.add('hide');
    }, 0);
}

function dragEnd(event) {
    event.target.classList.remove('hide');
}

document.querySelectorAll('.task-container').forEach(container=>{
    container.addEventListener('dragover', event =>{
        event.preventDefault();
    });
    container.addEventListener('drop', event =>{
        event.preventDefault();
        const id = event.dataTransfer.getData('text');
        const draggable = document.getElementById(id);
        if(draggable){
            container.appendChild(draggable);
        }
    });
});