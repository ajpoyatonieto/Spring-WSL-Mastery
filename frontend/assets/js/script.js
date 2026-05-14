const API_URL = `http://${location.hostname}:8080/api/tasks`;
const taskList = document.getElementById('taskList');
const taskTitle = document.getElementById('taskTitle');
const taskDesc = document.getElementById('taskDesc');
const deadlineInput = document.getElementById('deadlineInput');
const urgentInput = document.getElementById('urgentInput');
const importantInput = document.getElementById('importantInput');
const addBtn = document.getElementById('addBtn');
const cancelBtn = document.getElementById('cancelBtn');
const loginOverlay = document.getElementById('loginOverlay');

// Inicializar Calendario Premium
const fp = flatpickr("#deadlineInput", {
    altInput: true,
    altFormat: "F j, Y",
    dateFormat: "Y-m-d",
    theme: "dark"
});

// Estado
let currentTasks = [];
let sortCriteria = [
    { field: 'urgent', dir: 'desc' },
    { field: 'important', dir: 'desc' },
    { field: 'deadline', dir: 'asc' }
];
let editingId = null;

function getAuthHeader() {
    const auth = localStorage.getItem('task_auth');
    return auth ? { 'Authorization': `Basic ${auth}` } : {};
}

async function login() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    if (!user || !pass) return;
    const auth = btoa(`${user}:${pass}`);
    
    try {
        const response = await fetch(API_URL, {
            headers: { 'Authorization': `Basic ${auth}` }
        });
        
        if (response.ok) {
            localStorage.setItem('task_auth', auth);
            loginOverlay.style.display = 'none';
            fetchTasks();
        } else {
            document.getElementById('loginError').style.display = 'block';
        }
    } catch (error) {
        console.error('Login error:', error);
    }
}

async function logout() {
    localStorage.removeItem('task_auth');
    location.reload();
}

async function fetchTasks() {
    const headers = getAuthHeader();
    if (!headers.Authorization) {
        loginOverlay.style.display = 'flex';
        return;
    }

    try {
        const response = await fetch(API_URL, { headers });
        if (response.status === 401) {
            localStorage.removeItem('task_auth');
            loginOverlay.style.display = 'flex';
            return;
        }
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
        taskList.innerHTML = '<div class="loader">No hay tareas pendientes.</div>';
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
                <strong style="font-size: 1.1rem">${task.title}</strong>
                <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 5px;">${task.description || ''}</p>
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
    const title = taskTitle.value.trim();
    const description = taskDesc.value.trim();
    if (!title) return;

    const task = {
        title,
        description,
        urgent: urgentInput.checked,
        important: importantInput.checked,
        deadline: deadlineInput.value || null,
        completed: false
    };

    try {
        let response;
        const headers = { ...getAuthHeader(), 'Content-Type': 'application/json' };
        
        if (editingId) {
            const existing = currentTasks.find(t => t.id === editingId);
            task.completed = existing.completed;
            response = await fetch(`${API_URL}/${editingId}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(task)
            });
        } else {
            response = await fetch(API_URL, {
                method: 'POST',
                headers,
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
    taskTitle.value = task.title;
    taskDesc.value = task.description || '';
    fp.setDate(task.deadline || '');
    urgentInput.checked = task.urgent;
    importantInput.checked = task.important;
    
    cancelBtn.style.display = 'block';
    addBtn.innerText = 'Guardar Cambios';
    addBtn.style.background = 'var(--accent)';
    taskTitle.focus();
}

function resetForm() {
    editingId = null;
    taskTitle.value = '';
    taskDesc.value = '';
    fp.clear();
    urgentInput.checked = false;
    importantInput.checked = false;
    cancelBtn.style.display = 'none';
    addBtn.innerText = 'Añadir Tarea';
    addBtn.style.background = 'var(--primary)';
}

async function deleteTask(id) {
    if (!confirm('¿Estás seguro de borrar esta tarea?')) return;
    try {
        await fetch(`${API_URL}/${id}`, { 
            method: 'DELETE',
            headers: getAuthHeader()
        });
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
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
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
        container.innerHTML = '<span style="font-size: 0.8rem; color: var(--text-muted)">Sin ordenación</span>';
        return;
    }
    container.innerHTML = sortCriteria.map((c, i) => `
        <span class="sort-tag">${i+1}. ${c.field} ${c.dir === 'desc' ? '↓' : '↑'}</span>
    `).join(' ');
}

addBtn.addEventListener('click', handleSave);
cancelBtn.addEventListener('click', resetForm);
taskTitle.addEventListener('keypress', (e) => { if (e.key === 'Enter') taskDesc.focus(); });

window.toggleSort = toggleSort;
window.clearSort = clearSort;
window.startEdit = startEdit;
window.deleteTask = deleteTask;
window.toggleComplete = toggleComplete;
window.login = login;
window.logout = logout;

fetchTasks();
