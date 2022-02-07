'use strict';

const STORAGE_KEY = 'todosDB';
var gTodos;
var gFilterBy = 'ALL';
_createTodos();

function getTodosForDisplay() {
	if (gFilterBy === 'ALL') return gTodos;

	return gTodos.filter((todo) => (todo.isDone && gFilterBy === 'DONE') || (!todo.isDone && gFilterBy === 'ACTIVE'));
}

function sortTodos(sortBy) {
	switch (sortBy) {
		case 'CREATED':
			gTodos.sort((todo1, todo2) => todo1.createdAt - todo2.createdAt);
			break;
		case 'IMPORTANCE':
			gTodos.sort((todo1, todo2) => todo2.importance - todo1.importance);
			break;
		case 'TXT':
			gTodos.sort((todo1, todo2) => {
				if (todo1.txt > todo2.txt) {
					return -1;
				} else if (todo1.txt < todo2.txt) {
					return 1;
				}
				return 0;
			});
			break;
		default:
			break;
	}
}

function removeTodo(todoId) {
	const idx = gTodos.findIndex((todo) => todo.id === todoId);
	gTodos.splice(idx, 1);
	_saveTodosToStorage();
}

function toggleTodo(todoId) {
	var todo = gTodos.find((todo) => todo.id === todoId);
	todo.isDone = !todo.isDone;
	_saveTodosToStorage();
}

function addTodo(txt, importance) {
	const todo = _createTodo(txt, importance);
	gTodos.unshift(todo);
	_saveTodosToStorage();
}

function getTodosCount() {
	return gTodos.length;
}

function getActiveTodosCount() {
	const activeTodos = gTodos.filter((todo) => !todo.isDone);
	return activeTodos.length;
}

function setFilter(filterBy) {
	gFilterBy = filterBy;
}

function getFilter() {
	return gFilterBy;
}

function _createTodos() {
	gTodos = loadFromStorage(STORAGE_KEY);
	if (!gTodos || !gTodos.length) {
		gTodos = [ _createTodo('Learn HTML', 1), _createTodo('Study CSS', 2), _createTodo('Master Javascript', 3) ];
		_saveTodosToStorage();
	}
}

function _createTodo(txt, importance) {
	const todo = {
		id: _makeId(),
		txt: txt,
		importance: importance,
		isDone: false,
		createdAt: new Date().getTime()
	};
	return todo;
}

function _makeId(length = 5) {
	var txt = '';
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (var i = 0; i < length; i++) {
		txt += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return txt;
}

function _saveTodosToStorage() {
	saveToStorage(STORAGE_KEY, gTodos);
}

function switchTodos(aIdx, bIdx) {
	if (aIdx < 0 || bIdx < 0) return;
	if (aIdx >= gTodos.length || bIdx >= gTodos.length) return;
	const temp = gTodos[aIdx];
	gTodos[aIdx] = gTodos[bIdx];
	gTodos[bIdx] = temp;
}
