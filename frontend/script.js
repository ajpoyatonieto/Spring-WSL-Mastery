const API_URL = 'http://localhost:8080/api/tasks';
const taskList = document.getElementById('taskList');
const taskInput = document.getElementById('taskInput');
const deadlineInput = document.getElementById('deadlineInput');
const urgentInput = document.getElementById('urgentInput');
const importantInput = document.getElementById('importantInput');
const addBtn = document.getElementById('addBtn');

// Estado
let currentTasks = [];
let sortCriteria = [];
let editingId = null;

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
            <div class="status-dot" 
                 onclick="toggleComplete(${task.id})"
                 style="background: ${task.completed ? '#10b981' : (task.urgent ? '#ef4444' : (task.important ? '#f59e0b' : '#334155'))}; cursor: pointer"></div>
            <div class="task-info">
                <span>${task.title}</span>
                <div class="task-badges">
                    ${task.urgent ? '<span class="task-badge badge-urgent">Urgente</span>' : ''}
                    ${task.important ? '<span class="task-badge badge-important">Importante</span>' : ''}
                    ${deadlineStr ? `<span class="task-badge badge-deadline">📅 ${deadlineStr}</span>` : ''}
                </div>
            </div>
            <div class="task-actions">
                <button class="btn-action btn-edit" onclick="startEdit(${task.id})" title="Editar">✏️</button>
                <button class="btn-action btn-delete" onclick="deleteTask(${task.id})" title="Borrar">🗑️</button>
            </div>
        `;
        taskList.appendChild(item);
    });
}

async function handleSave() {
    const title = taskInput.value.trim();
    if (!title) return;

    const task = {
        title,
        urgent: urgentInput.checked,
        important: importantInput.checked,
        deadline: deadlineInput.value || null,
        completed: false
    };

    try {
        let response;
        if (editingId) {
            // EDITAR
            const existing = currentTasks.find(t => t.id === editingId);
            task.completed = existing.completed;
            response = await fetch(`${API_URL}/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(task)
            });
        } else {
            // CREAR
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(task)
            });
        }
        
        if (response.ok) {
            resetForm();
            fetchTasks();
        }
    } catch (error) {
        console.error('Error saving task:', error);
    }
}

function startEdit(id) {
    const task = currentTasks.find(t => t.id === id);
    if (!task) return;

    editingId = id;
    taskInput.value = task.title;
    deadlineInput.value = task.deadline || '';
    urgentInput.checked = task.urgent;
    importantInput.checked = task.important;
    
    addBtn.innerText = 'Guardar Cambios';
    addBtn.style.background = 'var(--accent)';
    taskInput.focus();
}

function resetForm() {
    editingId = null;
    taskInput.value = '';
    deadlineInput.value = '';
    urgentInput.checked = false;
    importantInput.checked = false;
    addBtn.innerText = 'Añadir Tarea';
    addBtn.style.background = 'var(--primary)';
}

async function deleteTask(id) {
    if (!confirm('¿Estás seguro de borrar esta tarea?')) return;
    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchTasks();
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

async function toggleComplete(id) {
    const task = currentTasks.find(t => t.id === id);
    if (!task) return;

    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...task, completed: !task.completed })
        });
        fetchTasks();
    } catch (error) {
        console.error('Error toggling complete:', error);
    }
}

function toggleSort(field) {
    const existingIdx = sortCriteria.findIndex(c => c.field === field);
    if (existingIdx > -1) {
        if (sortCriteria[existingIdx].dir === 'desc') sortCriteria[existingIdx].dir = 'asc';
        else sortCriteria.splice(existingIdx, 1);
    } else {
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
        <span class="sort-tag">${i+1}. ${c.field} ${c.dir === 'desc' ? '↓' : '↑'}</span>
    `).join(' ');
}

addBtn.addEventListener('click', handleSave);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSave();
});

window.toggleSort = toggleSort;
window.clearSort = clearSort;
window.startEdit = startEdit;
window.deleteTask = deleteTask;
window.toggleComplete = toggleComplete;

fetchTasks();
