// Constants for PHP script locations.
const BOOKS_READ_URL = "./php/books-read.php";
const BOOKS_CREATE_URL = "./php/books-create.php";
const BOOKS_UPDATE_URL = "./php/books-update.php";
const BOOKS_DELETE_URL = "./php/books-delete.php";

// App state constants.
const STATE_CREATE = "state-create";
const STATE_READ = "state-read";
const STATE_UPDATE = "state-update";
const STATE_DELETE = "state-delete";

// Keep track of app state
let currentState = STATE_CREATE;

/**
 * All the things start here :)
 */
window.addEventListener('DOMContentLoaded', (event) => {
    console.log("DOC ::: DOMContentLoaded");

    const btnCreate = document.body.querySelector('#btn-create');
    // btnCreate.classList.add('btn-hide');
    btnCreate.addEventListener('click', (event) => {
        console.log("DOC ::: btn-create click");
        event.preventDefault();
        const t = event.target;
        const inTitle = document.body.querySelector('input[name="book-title"]');
        const inAuthor = document.body.querySelector('input[name="book-author"]');
        const inPub = document.body.querySelector('input[name="book-pub"]');
        const inPrice = document.body.querySelector('input[name="book-price"]');

        const valTitle = inTitle.value;
        const valAuthor = inAuthor.value;
        const valPub = inPub.value;
        const valPrice = parseFloat(inPrice.value);

        // FIXME: validate input (or not)
        const book = {
            title: valTitle,
            author: valAuthor,
            publisher: valPub,
            price: valPrice
        }
        console.log(' - add book:', book);

        addBookAsync(book).then(showBooks);
        clearForm();
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
    btnUpdate.addEventListener('click', async (event) => {
        console.log("DOC ::: btn-update click");
        event.preventDefault();
        const t = event.target;
        const inId = document.body.querySelector('input[name="book-id"]');
        const inTitle = document.body.querySelector('input[name="book-title"]');
        const inAuthor = document.body.querySelector('input[name="book-author"]');
        const inPub = document.body.querySelector('input[name="book-pub"]');
        const inPrice = document.body.querySelector('input[name="book-price"]');

        const valId = inId.value;
        const valTitle = inTitle.value;
        const valAuthor = inAuthor.value;
        const valPub = inPub.value;
        const valPrice = parseFloat(inPrice.value);

        // FIXME: validate input (or not).
        const book = {
            id: valId,
            title: valTitle,
            author: valAuthor,
            publisher: valPub,
            price: valPrice
        }
        console.log(' - update book:', book);

        // updateBookAsync(book).then(showBooks);
        const books = await updateBookAsync(book);
        console.log(' - books:', books);
        // Display updated books.
        showBooks(books);

        const subTitle = document.body.querySelector('#sub-title');
        subTitle.innerText = "Add Book";

        btnUpdate.classList.add('btn-hide');
        btnCancel.classList.add('btn-hide');

        btnCreate.classList.remove('btn-hide');
        btnClear.classList.remove('btn-hide');

        setButtonState(STATE_CREATE);

        clearForm();

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

    getBooksAsync().then(showBooks);

});

/**
 * 
 */
function clearForm() {
    console.log("DOC ::: clearForm");

    const frm = document.body.querySelector('#form-container');
    // frm.reset();

    // May remove the form element, in which case 
    // all input fields have to be reset directly

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

}

function setButtonState(state) {
    console.log("DOC ::: setButtonState");
    console.log(' - state:', state);

    const btnUpdate = document.body.querySelector();

    if (state === STATE_CREATE) {
        const subTitle = document.body.querySelector('#sub-title');
        subTitle.innerText = "Add Book";

        btnUpdate.classList.add('btn-hide');
        btnCancel.classList.add('btn-hide');

        btnCreate.classList.remove('btn-hide');
        btnClear.classList.remove('btn-hide');


    }
}

/**
 * 
 * @param {*} books 
 */
function showBooks(books) {
    console.log("DOC ::: showBooks");
    let tmp = document.body.querySelector('template[name="tmp-table-row"]');
    let tbody = document.body.querySelector('#tb-books');

    // remove existing books
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    books.forEach(book => {
        let clone = tmp.content.cloneNode(true);
        let btns = clone.querySelectorAll('button');
        let tds = clone.querySelectorAll('td');
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

    // Use currentTarget to avoid getting child node(s), e.g. the button icon.
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

    const inp = t.parentNode.querySelector('input');
    console.log(' - input:', inp);

    const data = inp.value;
    console.log(' - data:', data);

    const book = JSON.parse(data);

    const msg = `
    <div class="container">
        <h6>Are you sure you want to delete this book?</h6>
        <div class="row">
            <div class="col-2 text-right">Title:</div>
            <div class="col"><code>${book.title}</code></div>
        </div>
        <div class="row">
            <div class="col-2 text-right">Author:</div>
            <div class="col"><code>${book.author}</code></div>
        </div>
    </div>`;

    bootbox.confirm({
        title: "Delete Book:",
        message: msg,
        callback: (confirmed) => {
            console.log("DOC ::: bootbox confirm");
            console.log(' - confirmed:', confirmed);
            if (confirmed) {
                // deleteBook(data).then(showBooks);
            }
        }
    });

}

/************************
 * 
 * CRUD METHODS
 * 
 ************************/

/**
 * Fetches book data from PHP.
 * 
 * @returns Resolved Promise with list of books payload.
 */
async function getBooksAsync() {
    console.log("DOC ::: getBooksAsync");
    let response = await fetch(BOOKS_READ_URL);
    let json = await response.json();
    console.log(' - json:', json);
    return json;
}

/**
 * Adds book.
 * Data is sent to PHP script which writes data to file.
 *
 * @param {*} book The new book data to add.
 * @returns Resolved Promise with list of books payload.
 */
async function addBookAsync(book) {
    console.log("DOC ::: addBook");
    console.log(' - book:', book);
    const json = JSON.stringify(book);
    console.log(' - json:', json);
    const headers = {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
    }
    // Send data to PHP
    const response = await fetch(BOOKS_CREATE_URL,
        {
            method: "POST",
            headers: headers,
            body: json
        });

    const data = await response.json();
    return data;
}

/**
 * Updates an existing book.
 *
 * @param {*} book The updated book.
 */
async function updateBookAsync(book) {
    console.log("DOC ::: updateBookAsync");
    const jbook = JSON.stringify(book);
    const headers = {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
    }
    const response = await fetch(BOOKS_UPDATE_URL,
        {
            method: "POST",
            headers: headers,
            body: jbook
        });
    const data = await response.json();
    return data;
}

/**
 * Deletes a book from the list of books.
 *
 * @param {*} json The book to be removed, as JSON formatted string.
 */
async function deleteBook(json) {
    console.log("DOC ::: deleteBook");
    console.log(' - json:', json);

    let headers = {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
    };

    let response = await fetch(BOOKS_DELETE_URL,
        {
            method: "POST",
            headers: headers,
            body: json
        });

    let books = await response.json();
    return books;
}