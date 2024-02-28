const taskInput = document.querySelector('.list-form input'), listControls = document.querySelectorAll('.btn-group button'),
    clearListButton = document.getElementById('clear-button'), taskList = document.querySelector('.task-list'),
    alertMessage = document.getElementById('alert'), currentDateValue = document.getElementById('dateValue')

window.onload = () => {
    taskInput.value = ''
    getCurrentDate()
    toDoTasksList('all')  
    toDoList.length < 1 ? clearListButton.disabled = true : clearListButton.disabled = false
}

const getCurrentDate = () => {
    let date = new Date().toLocaleDateString('es-mx', { weekday:"long", year:"numeric", month:"long", day:"numeric"})    
    let dateFormat = `Lista de tareas del día ${date}:`
    currentDateValue.textContent = dateFormat
}

var taskId, isEditedTask, taskElement = '', toDoList = JSON.parse(localStorage.getItem('to-do-list'))

/* Se cambia el estado  del botón y se muestra la lista dependiendo de cuál fue seleccionado  */
listControls.forEach(button => {
    button.addEventListener('click', () => {
        document.querySelector('button.active').classList.remove('active')
        button.classList.add('active')
        toDoTasksList(button.id)
    })
})

/* Agrega una nueva tarea cada que se llama al evento de la tecla Enter */
taskInput.addEventListener('keyup', event => {
    let newTask = taskInput.value.trim()
    if (event.key == 'Enter' && newTask) {
        /* Verifica si es una tarea nueva o si se está editando alguna ya existente */
        if (!isEditedTask) {
            toDoList = !toDoList ? [] : toDoList
            let taskInputValue = { name: newTask, status: 'pending' }
            toDoList.push(taskInputValue)
        } else {
            isEditedTask = false
            toDoList[taskId].name = newTask
        }
        taskInput.value = ''
        clearListButton.disabled = false
        localStorage.setItem('to-do-list', JSON.stringify(toDoList))
        toDoTasksList(document.querySelector('button.active').id)
    }
})

/* Se muestra la lista de tareas de acuerdo al estado de las mismas, dependiendo de cuál botón esté activo */
const toDoTasksList = (taskStatus) => {
    taskElement = ''
    if(toDoList) { 
        toDoList.forEach((task, id) => {
            let isCompleted = task.status == 'completed' ? 'checked' : ''
            if (taskStatus == task.status || taskStatus == 'all') {
                taskElement += `
                    <li class="task">
                        <label for="${id}">
                            <input onclick="updateTaskStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
                            <p class="${isCompleted}">${task.name}</p>
                        </label>
                        <div class="settings">
                            <i onclick="taskOptionsMenu(this)">&#xf141;</i>
                            <ul class="task-menu">                            
                                <li onclick='editTask(${id}, "${task.name}")'>&#xf044; Editar</li>
                                <li onclick='deleteTask(${id}, "${taskStatus}")'>&#xf55a; Borrar</li>
                            </ul>
                        </div>
                    </li>`
            }            
        })
    }
    taskList.innerHTML = taskElement || `<span>&#xf06a; &nbsp; Es posible que la lista esté vacía &nbsp; &#xf06a;</span>`
}

/* Verifica si el checkbox esta activo o no, si lo está se cambia el estado de la tarea a 'completada', si no, se cambia a 'pendiente' */
const updateTaskStatus = (task) => {
    let selectedTask = task.parentElement.lastElementChild
    task.checked ? (selectedTask.classList.add('checked'), toDoList[task.id].status = 'completed') 
        : (selectedTask.classList.remove('checked'), toDoList[task.id].status = 'pending')
    localStorage.setItem('to-do-list', JSON.stringify(toDoList))

    let alertText = task.checked ? 'Tarea completada | \u{f560}' : 'Esta tarea sigue pendiente | \u{f017}'
    alertMessage.textContent = alertText
    setTimeout(() => {
        alertMessage.classList.add('collapse')
    }, 3000, alertMessage.classList.remove('collapse'));
}

/* Muestra u oculta el menú de opciones de la tarea que se seleccionó */
const taskOptionsMenu = (task) => {
    let menu = task.parentElement.lastElementChild
    menu.classList.add('show')
    document.addEventListener('click', event => {
        event.target != task || event.target.tagName != 'I' ? (menu.classList.remove('show'), task.style.color = 'black') 
            : (menu.classList.add('show'), task.style.color = '#dc3545')       
    })
}

/* Manda el texto al input para poder editar su contenido, asignando su id a una variable para sobrescribir su valor */
const editTask = (id, name) => {
    isEditedTask = true
    taskId = id
    taskInput.value = name, taskInput.focus()
}

/* Remueve la nota seleccionada de la lista de tareas */
const deleteTask = (id, name) => {
    isEditedTask = false
    toDoList.splice(id, 1) //*(position: id, remove: 1)
    localStorage.setItem('to-do-list', JSON.stringify(toDoList))
    toDoTasksList(name)
}

/* Limpia toda la lista de tareas una vez se confirma la acción */
var myModal = new bootstrap.Modal(document.getElementById('modal'), { keyboard: false })
const clearList = () => {
    isEditedTask = false
    toDoList.splice(0, toDoList.length)
    localStorage.setItem('to-do-list', JSON.stringify(toDoList))
    toDoTasksList()
    myModal.hide()
    clearListButton.disabled = true
}