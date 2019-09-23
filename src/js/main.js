
const BOOKS_READ_URL = "./php/books-read.php";
const BOOKS_CREATE_URL = "./php/books-create.php";
const BOOKS_UPDATE_URL = "./php/books-update.php";
const BOOKS_DELETE_URL = "./php/books-delete.php";

const STATE_CREATE = "state-create";
const STATE_READ = "state-read";
const STATE_UPDATE = "state-update";
const STATE_DELETE = "state-delete";

let currentState = STATE_CREATE;

window.addEventListener('DOMContentLoaded', (event) => {
    console.log("DOC ::: DOMContentLoaded");

    const btnCreate = document.body.querySelector('#btn-create');
    // btnCreate.classList.add('btn-hide');
    btnCreate.addEventListener('click', (event) => {
        console.log("DOC ::: btn-create click");
        event.preventDefault();
        const t = event.target;
    });

    const btnClear = document.body.querySelector('#btn-clear');
    // btnClear.classList.add('btn-hide');
    btnClear.addEventListener('click', (event) => {
        console.log("DOC ::: btn-clear click");
        event.preventDefault();
        const t = event.target;
        clearForm();
    });

    const btnUpdate = document.body.querySelector('#btn-update');
    btnUpdate.classList.add('btn-hide');
    btnUpdate.addEventListener('click', (event) => {
        console.log("DOC ::: btn-update click");
        event.preventDefault();
        const t = event.target;
    });

    const btnCancel = document.body.querySelector('#btn-cancel');
    btnCancel.classList.add('btn-hide');
    btnCancel.addEventListener('click', (event) => {
        console.log("DOC ::: btn-create click");
        event.preventDefault();

        const subTitle = document.body.querySelector('#sub-title');
        subTitle.innerText = "Add Book";

        btnUpdate.classList.add('btn-hide');
        btnCancel.classList.add('btn-hide');

        btnCreate.classList.remove('btn-hide');
        btnClear.classList.remove('btn-hide');
        clearForm();
    })

    clearForm();

    getBooks().then(showBooks);

});

/**
 * 
 */
function clearForm() {
    console.log("DOC ::: clearForm");
    const frm = document.body.querySelector('form');

    const bookId = frm.querySelector('input[name="book-id"]');
    bookId.value = "";

    const bookPrice = frm.querySelector('input[name="book-price"]');
    bookPrice.value = 0;

    const bookTitle = frm.querySelector('input[name="book-title"]');
    bookTitle.value = "";

    const bookAuthor = frm.querySelector('input[name="book-author"]');
    bookAuthor.value = "";

    const bookPub = frm.querySelector('input[name="book-pub"]');
    bookPub.value = "";
    // frm.reset();
}

/**
 * 
 */
async function getBooks() {
    console.log("DOC ::: getBooks");
    let response = await fetch(BOOKS_READ_URL);
    let json = await response.json();
    console.log(' - json:', json);
    return json;
}

/**
 * 
 * @param {*} books 
 */
function showBooks(books) {
    console.log("DOC ::: showBooks");
    let tmp = document.body.querySelector('template[name="tmp-table-row"]');
    let tbody = document.body.querySelector('#tb-books');
    books.forEach(book => {
        let clone = tmp.content.cloneNode(true);
        let btns = clone.querySelectorAll('button');
        let tds = clone.querySelectorAll('th,td');
        // console.log('tds:', tds);
        tds[0].innerText = book.id;
        tds[1].innerText = book.title;
        tds[2].innerText = book.author;
        tds[3].innerText = book.publisher;
        tds[4].innerText = book.price.toFixed(2);
        // console.log(' - price:', book.price, book.price.toFixed(2));

        // edit book button
        btns[0].addEventListener('click', editBookClickHandler);
        // delete book button
        btns[1].addEventListener('click', deleteBookClickHandler);

        let json = JSON.stringify(book);
        const inp = clone.querySelector('input[type="hidden"]');
        inp.value = json;

        tbody.append(clone);
    });

}

/**
 * 
 * @param {*} event 
 */
function editBookClickHandler(event) {
    console.log("DOC ::: editBookClickHandler");
    // Use currentTarget to avoid getting child nodes
    let t = event.currentTarget;
    console.log(' - target:', t);
    const inp = t.parentNode.querySelector('input');
    console.log(' - input:', inp);
    const val = inp.value;
    let data = JSON.parse(val);
    console.log(' - data:', data);

    const bookId = document.body.querySelector('input[name="book-id"]');
    bookId.value = data.id;
    console.log(' - book id:', bookId);

    const bookAuthor = document.body.querySelector('input[name="book-author"]');
    bookAuthor.value = data.author;
    console.log(' - book author:', bookAuthor);

    const bookTitle = document.body.querySelector('input[name="book-title"]');
    bookTitle.value = data.title;
    console.log(' - book title:', bookTitle);

    const bookPub = document.body.querySelector('input[name="book-pub"]');
    bookPub.value = data.publisher;

    const bookPrice = document.body.querySelector('input[name="book-price"]');
    bookPrice.value = data.price.toFixed(2);

    // Show 'Update' and 'Cancel' button
    const btnUpdate = document.body.querySelector('#btn-update');
    btnUpdate.classList.remove('btn-hide');

    const btnCancel = document.body.querySelector('#btn-cancel');
    btnCancel.classList.remove('btn-hide');

    // Hide 'Submit' and 'Clear' buttons
    const btnCreate = document.body.querySelector('#btn-create');
    btnCreate.classList.add('btn-hide');

    const btnClear = document.body.querySelector('#btn-clear');
    btnClear.classList.add('btn-hide');

    const subTitle = document.body.querySelector('#sub-title');
    subTitle.innerText = "Update Book";

}

/**
 * 
 * @param {*} event 
 */
function deleteBookClickHandler(event) {
    console.log("DOC ::: deleteBookClickHandler");
    let t = event.currentTarget;
    console.log(' - target:', t);

}

function displayData(e) {
    let id = 0;
    const td = $("#tbody tr td");
    let textvalues = [];

    for (const value of td) {
        if (value.dataset.id == e.target.dataset.id) {
            textvalues[id++] = value.textContent;
        }
    }
    return textvalues;

}