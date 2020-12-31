
// let lists = [{
//   id: 1,
//   name: 'name'
// }, {
//     id: 2,
//     name: 'todo'
//   }];

// let lists = [];

const listsContainer = document.querySelector('.task-list');
const newListForm = document.getElementById('new_list_form');
const newListInput = document.getElementById('new_list_input');
const deleteListButton = document.getElementById('btn_delete');
const clearListButton = document.getElementById('btn_clear');
const listDisplayContainer = document.querySelector('.todo-list');
const listTitle = document.querySelector('.list-title');
const listCount= document.querySelector('.task-count');
const dataTasks = document.querySelector('.tasks');
// console.log(dataTasks)
const taskTemplate = document.getElementById('task-template');
// console.log(taskTemplate);
const taskInput = document.getElementById('data-new-task-input');
const newTaskForm = document.querySelector('.data-task-new-form');
console.log(newTaskForm);

const LOCAL_STORAGE_LIST_KEY = 'task.lists';
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId';
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);


listsContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'li') {
    selectedListId = e.target.dataset.listId;
    // console.log(e.target.dataset.listId);
    saveAndRender();
  }
});
dataTasks.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'input'){
    const selectedList = lists.find(list => list.id === selectedListId)
    const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
    // console.log(e.target.checked);
    selectedTask.complete = e.target.checked
  save()
  renderTaskCount(selectedList)
}
});


deleteListButton.addEventListener('click', e => {
  // list.id !== selectedListIdをfilterで抽出する
  // 連想配列
  lists = lists.filter(list => list.id !== selectedListId)
  // console.log(lists);
  // 残りのlistを抽出し返す
  selectedListId = null;
  // console.log(selectedListId)
  saveAndRender();
})

// チェックが入っていない要素だけを抽出他は削除
clearListButton.addEventListener('click', e => {
  const selectedList = lists.find(list => list.id === selectedListId);
  selectedList.tasks = selectedList.tasks.filter(task => !task.complete);
  console.log(selectedList.tasks)
  saveAndRender();
});


// インプット要素でリスト作成
newListForm.addEventListener('submit', e => {
  e.preventDefault();
  const listName = newListInput.value;
  if (listName == null || listName === '') return
  const list = createList(listName);
  console.log(lists)
  newListInput.value = null;
  lists.push(list)
  saveAndRender();
});

// インプット要素でtask作成
newTaskForm.addEventListener('submit', e => {
  e.preventDefault();
  const taskName = taskInput.value;
  if (taskName === '') return;
  const task = createTask(taskName);
  taskInput.value = null;
  const selectedList = lists.find(list => list.id === selectedListId);
  selectedList.tasks.push(task);
  saveAndRender();
});


// 入力された値をデータに変換
function createList(name) {
  return {
    id: Date.now().toString(), name: name, tasks: []
  }
}
function createTask(name) {
  return {
    id: Date.now().toString(), name: name, complete: false
  }
}
// セーブ
function saveAndRender() {
  save();
  render();
}
// localStorage
function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
}

// 右リスト
function render() {
  clearElement(listsContainer);
  renderLists();

  // ()の中身の処理をfindで抽出
  const selectedList = lists.find(list => list.id === selectedListId);
  // console.log(selectedList.name)
  if (selectedListId == null) {
    listDisplayContainer.style.display = 'none';
  } else {
    // 選択したタスクの名前がタイトルに反映される
    listDisplayContainer.style.display = '';
    listTitle.innerText = selectedList.name;
    // renderTaskCount(selectedListId);
    renderTaskCount(selectedList);
    clearElement(dataTasks)
    renderTasks(selectedList)
  }
}

function renderTasks(selectedList) {
  selectedList.tasks.forEach(task => {
    const taskElement = document.importNode(taskTemplate.content, true);
    const checkbox = taskElement.querySelector('input');
    checkbox.id = task.id;
    checkbox.checked = task.complete;
    console.log(task.complete)
    const label = taskElement.querySelector('label');

    label.htmlFor = task.id;
    label.append(task.name);
    dataTasks.appendChild(taskElement);
  });
}

function renderTaskCount(selectedList) {
  const listsCount = selectedList.tasks.filter(task =>
    !task.complete).length;
  listCount.innerText = `${listsCount} reamining`
}

// 左リストを作る
function renderLists() {
  // <li class="list-name">Work</li>
  lists.forEach(list => {
    const listElement = document.createElement('li');
    listElement.dataset.listId = list.id;
    listElement.classList.add('list-name');
    listElement.innerText = list.name;
    if (list.id === selectedListId) {
      listElement.classList.add('active-list');
    }
    listsContainer.appendChild(listElement);
    // console.log(listElement)
  });
}

// キャッシュを消去 子要素
function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}


render();