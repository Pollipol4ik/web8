//Создаёт кнопку для пагинации
function createPageBtn(page, classes=[]) {
    let btn = document.createElement('button');
    classes.push('btn');
    for (cls of classes) {
        btn.classList.add(cls);
    }
    btn.dataset.page = page;
    btn.innerHTML = page;
    return btn;
}
//Отрисовка элементов пагинации
function renderPaginationElement(info) {
    let btn;
    let paginationContainer = document.querySelector('.pagination');
    paginationContainer.innerHTML = '';

    btn = createPageBtn(1, ['first-page-btn']);
    btn.innerHTML = 'Первая страница';
    if (info.current_page == 1) {
        btn.style.visibility = 'hidden';
    }
    paginationContainer.append(btn);

    let buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('pages-btns');
    paginationContainer.append(buttonsContainer);

    let start = Math.max(info.current_page - 2, 1);
    let end = Math.min(info.current_page + 2, info.total_pages);
    for (let i = start; i <= end; i++) {
        buttonsContainer.append(createPageBtn(i, i == info.current_page ? ['active'] : []));
    }

    btn = createPageBtn(info.total_pages, ['last-page-btn']);
    btn.innerHTML = 'Последняя страница';
    if (info.current_page == info.total_pages) {
        btn.style.visibility = 'hidden';
    }
    paginationContainer.append(btn);
}
//Обработчик события для кнопки выбора кол-ва записей
function perPageBtnHandler(event) {
    downloadData(1);
}
//Устанавливает инф-ю о пагинации на стр-це
function setPaginationInfo(info) {
    document.querySelector('.total-count').innerHTML = info.total_count;
    let start = info.total_count > 0 ? (info.current_page - 1)*info.per_page + 1 : 0;
    document.querySelector('.current-interval-start').innerHTML = start;
    let end = Math.min(info.total_count, start + info.per_page - 1)
    document.querySelector('.current-interval-end').innerHTML = end;
}
//для кнопки переключения
function pageBtnHandler(event) {
    if (event.target.dataset.page) {
        downloadData(event.target.dataset.page);
        window.scrollTo(0, 0);
    }
}
// имя автора записи
function createAuthorElement(record) {
    let user = record.user || {'name': {'first': '', 'last': ''}};
    let authorElement = document.createElement('div');
    authorElement.classList.add('author-name');
    authorElement.innerHTML = user.name.first + ' ' + user.name.last;
    return authorElement;
}
// кол-во голосов записи
function createUpvotesElement(record) {
    let upvotesElement = document.createElement('div');
    upvotesElement.classList.add('upvotes');
    upvotesElement.innerHTML = record.upvotes;
    return upvotesElement;
}
// футер записи
function createFooterElement(record) {
    let footerElement = document.createElement('div');
    footerElement.classList.add('item-footer');
    footerElement.append(createAuthorElement(record));
    footerElement.append(createUpvotesElement(record));
    return footerElement;
}
// содержимое записи
function createContentElement(record) {
    let contentElement = document.createElement('div');
    contentElement.classList.add('item-content');
    contentElement.innerHTML = record.text;
    return contentElement;
}
// отображение самой записи
function createListItemElement(record) {
    let itemElement = document.createElement('div');
    itemElement.classList.add('facts-list-item');
    itemElement.append(createContentElement(record));
    itemElement.append(createFooterElement(record));
    return itemElement;
}
// отображение выпадающего списка
function renderRecords(records) {
    let factsList = document.querySelector('.facts-list');
    factsList.innerHTML = '';
    for (let i = 0; i < records.length; i++) {
        factsList.append(createListItemElement(records[i]));
    }
}

//Выпадающий список автозаполнения
function renderAutocomplete(autocomplete){
    let autocompleteList = document.querySelector('.autocomplete-form');
    for (let i = 0; i < autocomplete.length; i++) {
        let autocompleteElement = document.createElement('div');
        autocompleteElement.classList.add('autocomplete');
        autocompleteElement.innerHTML = autocomplete[i];
        autocompleteList.append(autocompleteElement);
    }
}
//  очищает содержимое контейнера
function clearAutocomplete(){
    let autocompleteList = document.querySelector('.autocomplete-form')
    autocompleteList.innerHTML = "";
}
// загрузка данных автозаполнения
function downloadAutocomplite(){
    clearAutocomplete();
    let autocomplete = document.querySelector('.autocomplite');
    let url = new URL(autocomplete.dataset.url);
    let searchText = document.querySelector('.search-field').value;
    url.searchParams.append('q', searchText);
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = function () {
        renderAutocomplete(this.response);
    }
    xhr.send();
}
//загрузка данных
function downloadData(page=1) {
    let factsList = document.querySelector('.facts-list');
    let url = new URL(factsList.dataset.url);
    let perPage = document.querySelector('.per-page-btn').value;
    let search = document.querySelector('.search-field').value;
    url.searchParams.append('q', search);
    url.searchParams.append('page', page);
    url.searchParams.append('per-page', perPage);
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = function () {
        renderRecords(this.response.records);
        setPaginationInfo(this.response['_pagination']);
        renderPaginationElement(this.response['_pagination']);
    }
    xhr.send();
}
// кнопка поиск
function searchBtnHandler(event){
    downloadData(1);
}
// выбор значения из автозаполнения
function autocompleteHandler(event){
    document.querySelector('.search-field').value = event.srcElement.innerHTML
    clearAutocomplete();
}

window.onload = function () {
    downloadData(1);
    document.querySelector('.pagination').onclick = pageBtnHandler;
    document.querySelector('.per-page-btn').onchange = perPageBtnHandler;
    document.querySelector('.search-btn').onclick = searchBtnHandler;
    document.querySelector('.search-field').oninput = downloadAutocomplite;
    document.querySelector('.autocomplete-form').onclick = autocompleteHandler;
}