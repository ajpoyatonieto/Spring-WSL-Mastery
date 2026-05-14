const API_URL = 'http://localhost:8080/api/tasks';
const taskList = document.getElementById('taskList');
const taskInput = document.getElementById('taskInput');
const deadlineInput = document.getElementById('deadlineInput');
const urgentInput = document.getElementById('urgentInput');
const importantInput = document.getElementById('importantInput');
const addBtn = document.getElementById('addBtn');

// Estado de ordenación
let currentTasks = [];
let sortCriteria = []; // Ejemplo: [{field: 'urgent', dir: 'desc'}]

async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        currentTasks = await response.json();
        applySortAndRender();
    } catch (error) {
        console.error('Error fetching tasks:', error);
        taskList.innerHTML = '<div class="loader">Error conectando con el backend.</div>';
    }
}

function applySortAndRender() {
    let sorted = [...currentTasks];
    
    if (sortCriteria.length > 0) {
        sorted.sort((a, b) => {
            for (let criterion of sortCriteria) {
                let valA = a[criterion.field];
                let valB = b[criterion.field];

                // Manejo especial para fechas
                if (criterion.field === 'deadline') {
                    valA = valA ? new Date(valA).getTime() : Infinity;
                    valB = valB ? new Date(valB).getTime() : Infinity;
                }

                if (valA < valB) return criterion.dir === 'asc' ? -1 : 1;
                if (valA > valB) return criterion.dir === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }

    renderTasks(sorted);
    renderSortIndicators();
}

function renderTasks(tasks) {
    if (tasks.length === 0) {
        taskList.innerHTML = '<div class="loader">No hay tareas.</div>';
        return;
    }

    taskList.innerHTML = '';
    tasks.forEach(task => {
        const item = document.createElement('div');
        item.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        const deadlineStr = task.deadline ? new Date(task.deadline).toLocaleDateString() : '';
        
        item.innerHTML = `
            <div class="status-dot" style="background: ${task.urgent ? '#ef4444' : (task.important ? '#f59e0b' : '#10b981')}"></div>
            <div class="task-info">
                <span>${task.title}</span>
                <div class="task-badges">
                    ${task.urgent ? '<span class="task-badge badge-urgent">Urgente</span>' : ''}
                    ${task.important ? '<span class="task-badge badge-important">Importante</span>' : ''}
                    ${deadlineStr ? `<span class="task-badge badge-deadline">📅 ${deadlineStr}</span>` : ''}
                </div>
            </div>
        `;
        taskList.appendChild(item);
    });
}

async function addTask() {
    const title = taskInput.value.trim();
    if (!title) return;

    const task = {
        title,
        completed: false,
        urgent: urgentInput.checked,
        important: importantInput.checked,
        deadline: deadlineInput.value || null
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        });
        
        if (response.ok) {
            // Limpiar inputs
            taskInput.value = '';
            deadlineInput.value = '';
            urgentInput.checked = false;
            importantInput.checked = false;
            fetchTasks();
        }
    } catch (error) {
        console.error('Error adding task:', error);
    }
}

// Lógica de Ordenación
function toggleSort(field) {
    const existingIdx = sortCriteria.findIndex(c => c.field === field);
    
    if (existingIdx > -1) {
        // Si ya existe, cambiamos dirección o eliminamos
        if (sortCriteria[existingIdx].dir === 'desc') {
            sortCriteria[existingIdx].dir = 'asc';
        } else {
            sortCriteria.splice(existingIdx, 1);
        }
    } else {
        // Añadir nuevo criterio al final (orden de selección)
        sortCriteria.push({ field, dir: 'desc' });
    }
    applySortAndRender();
}

function clearSort() {
    sortCriteria = [];
    applySortAndRender();
}

function renderSortIndicators() {
    const container = document.getElementById('sortIndicators');
    if (!container) return;

    if (sortCriteria.length === 0) {
        container.innerHTML = '<span style="font-size: 0.8rem; color: var(--text-muted)">Orden por defecto</span>';
        return;
    }

    container.innerHTML = sortCriteria.map((c, i) => `
        <span class="sort-tag">
            ${i+1}. ${c.field} ${c.dir === 'desc' ? '↓' : '↑'}
        </span>
    `).join(' ');
}

// Event Listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// Exponer funciones al window para los botones de la UI
window.toggleSort = toggleSort;
window.clearSort = clearSort;

fetchTasks();
