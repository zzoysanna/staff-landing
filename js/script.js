const baseName = 'ss', indexedDB = window.indexedDB;

window.onload = function(){

    const resumeBtn = document.querySelector('#resumeBtn'),
          hireBtn = document.querySelector('#hireBtn'),
          shareBtn = document.querySelector('#shareBtn');

    connectDB(res => console.log(res));

    if(resumeBtn) {
        resumeBtn.addEventListener('click', sendForm);
    }
    if(hireBtn) {
        hireBtn.addEventListener('click', sendForm);
    }
    if(shareBtn) {
        shareBtn.addEventListener('click', sendForm);
    }

};

function sendForm(event) {
    event.preventDefault();
    let formSelector, storeName;

    switch (event.target.id) {
        case 'resumeBtn':
            formSelector = '#resumeForm';
            storeName = 'applicants';
            break;
        case 'hireBtn':
            formSelector = '#hireForm';
            storeName = 'vacancies';
            break;
        case 'shareBtn':
            formSelector = '#shareForm';
            storeName = 'teams';
            break;
    }
    const formData = new FormData(document.querySelector(formSelector));
    const dataObj = convertFormData(formData);

    saveData(dataObj, storeName);
}

function convertFormData(formData) {
    let dataObject = {
        id: Number(new Date),
    };
    formData.forEach((value, key) => dataObject[key] = value);
    return dataObject;
}

function saveData(json, storeName) {
    connectDB((db) => {
        let transaction = db.transaction([storeName], 'readwrite');
        let store = transaction.objectStore(storeName);
        store.put(json);
        transaction.oncomplete = () => console.log('data stored!');
        transaction.onerror = (event) => console.error(event);
    })
}


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
