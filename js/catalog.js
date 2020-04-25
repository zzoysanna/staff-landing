const baseName = 'ss', indexedDB = window.indexedDB;

window.onload = function() {

    connectDB(res => console.log(res));

    getTable('applicants');
    getTable('teams');
    getTable('vacancies');

};

function connectDB(callback){
    const request = indexedDB.open(baseName, 1);
    request.onerror = (error) => console.log(error);

    request.onsuccess = (event) => callback(event.currentTarget.result);

    request.onupgradeneeded = (event) => {
        const db = event.currentTarget.result;
        db.createObjectStore('applicants', { keyPath: "id" });
        db.createObjectStore('vacancies', { keyPath: "id" });
        db.createObjectStore('teams', { keyPath: "id" });
        callback(db);
    }
}

function getTable(storeName) {
    connectDB((db) => {
        let transaction = db.transaction([storeName], 'readwrite');
        let store = transaction.objectStore(storeName);
        let cursorRequest = store.openCursor();
        let allNotes = [];

        cursorRequest.onerror = (error) => console.error(error);

        cursorRequest.onsuccess = (event) => {
            let cursor = event.target.result;
            if(cursor) {
                allNotes.push(cursor.value);
                cursor.continue();
            } else {
                displayList(storeName, allNotes);
            }
        }
    })
}

function displayList(name, notes) {
    const container = document.querySelector('#' + name);
    let callBack;
    switch (name) {
        case 'teams':
            callBack = renderTeams;
            break;
        case 'applicants':
            callBack = renderApplicants;
            break;
        case 'vacancies':
            callBack = renderVacancies;
            break;
    }
    let html = '<ul>';
    html += notes.reduce((htmlList, note) => callBack(htmlList, note), '');
    html += '</ul>';

    container.innerHTML += html;
}

function renderTeams(list, note) {
    return list +=
        `<li>
            <span class="card-title">${note.specialty}</span>
            <div class="info">
                <span class="number">Количество сотрудников: ${note.number}</span>
                <span class="load">Тип занятости: ${note.load === 'fulltime' ? 'полная' : 'частичная'}</span>
            </div>
        </li>`
};

function renderApplicants(list, note) {
    return list +=
        `<li>
            <span class="card-title">${note.specialty}, ${note.age}</span>
            <span>Тип занятости: ${note.load === 'fulltime' ? 'полная' : 'частичная'}</span>
        </li>`
}

function renderVacancies(list, note) {
    return list +=
        `<li>
            <span class="card-title">${note.vacancy}</span>
            <div class="info">
                <span class="number">Количество сотрудников: ${note.number}</span>
                <span>Тип занятости: ${note.load === 'fulltime' ? 'полная' : 'частичная'}</span>
            </div>    
        </li>`
}
