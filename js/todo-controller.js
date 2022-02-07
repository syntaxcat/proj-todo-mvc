'use strict';

function onInit() {
	renderTodos();
}

function onRemoveTodo(ev, todoId) {
	ev.stopPropagation();
	if (!confirm('Are you sure want to delete? ')) {
		return;
	}
	console.log('Removing Todo', todoId);

	removeTodo(todoId);
	renderTodos();
}

function renderTodos() {
	const currFilter = getFilter();
	const todos = getTodosForDisplay();
	var strHTMLs = todos.map(
		(todo, idx) =>
			`<li class="${todo.isDone ? 'done' : ''}"
			onclick="onToggleTodo('${todo.id}')">
           ${todo.txt}-${todo.importance}
			${currFilter === 'ALL'
				? `
			<button ${idx === 0 ? 'disabled' : ''} onclick="onArrowUp(event, ${idx})">${getArrowUpSVG()}</button>
			<button ${idx === todos.length - 1
				? 'disabled'
				: ''} onclick="onArrowDown(event, ${idx})">${getArrowDownSVG()}</button>
			`
				: ''} 
				<button onclick="onRemoveTodo(event, '${todo.id}')">${getTrashBinSVG()}
			</button>
			<span>${new Date(todo.createdAt).toLocaleString()}</span>
        </li>`
	);

	document.querySelector('.todo-list').innerHTML = strHTMLs.join('');

	if (todos.length === 0) {
		document.querySelector('.no-todos-msg').display = 'block';
		document.querySelector('.no-todos-msg').innerText = 'No todos / No Active Todos, No Done Todos';
	} else {
		document.querySelector('.no-todos-msg').display = 'none';
		document.querySelector('.no-todos-msg').innerText = '';
	}
	document.querySelector('.todos-total-count').innerText = getTodosCount();
	document.querySelector('.todos-active-count').innerText = getActiveTodosCount();
}

function onToggleTodo(todoId) {
	console.log('Toggling', todoId);
	toggleTodo(todoId);

	renderTodos();
}

function onAddTodo() {
	const elTxt = document.querySelector('input[name=todoTxt]');
	const elNum = document.querySelector('input[name=importance]');
	const txt = elTxt.value;
	const importance = elNum.value;
	if (txt.trim() === '') return;
	if (importance.trim() === '') return;
	if (+importance < 1 || +importance > 3) return;
	addTodo(txt, importance);

	elTxt.value = '';
	elNum.value = '';
	renderTodos();
}

function onSetFilter(ev, filterBy) {
	console.log('Filtering By:', filterBy);
	const currSelected = document.querySelector('.filter-options .selected');
	if (currSelected !== null) {
		currSelected.classList.remove('selected');
	}
	ev.target.classList.add('selected');

	setFilter(filterBy);
	renderTodos();
}

function onSort(sortBy) {
	console.log('Filtering By:', sortBy);

	sortTodos(sortBy);
	renderTodos();
}

function onArrowUp(ev, idx) {
	ev.stopPropagation();
	switchTodos(idx, idx - 1);
	renderTodos();
}

function onArrowDown(ev, idx) {
	ev.stopPropagation();
	switchTodos(idx, idx + 1);
	renderTodos();
}

function getArrowDownSVG() {
	return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-down"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>';
}

function getArrowUpSVG() {
	return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-up"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>';
}

function getTrashBinSVG() {
	return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>';
}
