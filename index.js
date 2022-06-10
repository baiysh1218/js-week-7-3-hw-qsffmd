// Import stylesheets
import './style.css';

// Запросы, XMLHttpRequest, AJAX.  Домашняя работа

// Создать контактную книжку на основе Todo List.
// Функционал должен включать в себя:

// 1. Создание контакта (Имя, Фамилия, номер телефона)
// 2. Удаление контакта
// 3. Список контактов на главном экране
// 4. Использовать json-server.
// 5. Редактирование контакта
// 6. Пагинация(дополнительно)
// 7. Поиск(дополнительно)

const API = 'http://localhost:8000/data';

let app = document.getElementById('app');
let inpFirstName = document.getElementById('inp-first-name');
let inpLastName = document.getElementById('inp-last-name');
let inpNum = document.getElementById('inp-num');
let btnSave = document.getElementById('btn-save');
let list = document.getElementById('list');

btnSave.addEventListener('click', async function () {
  let newData = {
    first: inpFirstName.value,
    last: inpLastName.value,
    num: inpNum.value,
  };
  if (
    newData.first.trim() === '' &&
    newData.last.trim() === '' &&
    newData.num.trim() === ''
  ) {
    alert('заполните поля!');
    return;
  }
  await fetch(API, {
    method: 'POST',
    body: JSON.stringify(newData),
    headers: {
      'Content-type': 'application/json; charset=utf-8',
    },
  });
  inpFirstName.value = '';
  inpLastName.value = '';
  inpNum.value = '';
  getData();
});

let inpSearch = document.getElementById('search');
inpSearch.addEventListener('input', function () {
  getData();
});

let pagination = document.getElementById('pagination');
let page = 1;

async function getData() {
  let response = await fetch(
    `${API}?q=${inpSearch.value}&_page=${page}&_limit=2`
  )
    .then((res) => res.json())
    .catch((err) => console.log(err));

  let allData = await fetch(API)
    .then((res) => res.json())
    .catch((err) => console.log(err));

  let lastPage = Math.ceil(allData.length / 2);
  list.innerHTML = '';

  response.forEach((item) => {
    let newElem = document.createElement('div');
    newElem.id = item.id;
    newElem.innerHTML = `
    <span class="inp-info">Имя: ${item.first},</span>
    <span class="inp-info">Фамилия: ${item.last},</span>
    <span class="inp-info">Номер телефона: ${item.num},</span>
    <button id = "btn-delete">Delete</button>
    <button id = "btn-edit">Edit</button>
    `;
    list.append(newElem);
  });
  pagination.innerHTML = `
  <button id="btn-prev" ${page === 1 ? 'disabled' : ''}>prev</button>
  <span>${page}</span>
  <button ${page === lastPage ? 'disabled' : ''} id="btn-next">next</button>
  `;
}
getData();

let modalEdit = document.getElementById('edit');
let editFirstName = document.getElementById('edit-first-name');
let editLastName = document.getElementById('edit-last-name');
let editNum = document.getElementById('edit-num');
let btnSaveEdit = document.getElementById('saveEdit');
let btnClose = document.getElementById('btn-close');
let inpId = document.getElementById('inp-id');

btnClose.addEventListener('click', function () {
  modalEdit.style.display = 'none';
});

btnSaveEdit.addEventListener('click', async function () {
  let editData = {
    first: editFirstName.value,
    last: editLastName.value,
    num: editNum.value,
  };
  let id = inpId.value;
  await fetch(`${API}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(editData),
    headers: {
      'Content-type': 'application/json; charset=utf-8',
    },
  });

  modalEdit.style.display = 'none';
  getData();
});

document.addEventListener('click', async function (e) {
  if (e.target.id === 'btn-delete') {
    let id = e.target.parentNode.id;
    console.log(id, 'btn-id');
    await fetch(API + '/' + id, {
      method: 'DELETE',
    });
    getData();
  }
  if (e.target.id === 'btn-edit') {
    modalEdit.style.display = 'flex';
    let id = e.target.parentNode.id;
    let result = await fetch(`${API}/${id}`)
      .then((res) => res.json())
      .catch((err) => console.log(err));
    editFirstName.value = result.first;
    editLastName.value = result.last;
    editNum.value = result.num;
    inpId.value = result.id;
  }
  if (e.target.id === 'btn-next') {
    page++;
    getData();
  }
  if (e.target.id === 'btn-prev') {
    page--;
    getData();
  }
});
