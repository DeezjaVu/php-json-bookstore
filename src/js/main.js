
// Constants for PHP CRUD script locations.
const BOOKS_CREATE_URL = "./php/books-create.php";
const BOOKS_READ_URL = "./php/books-read.php";
const BOOKS_UPDATE_URL = "./php/books-update.php";
const BOOKS_DELETE_URL = "./php/books-delete.php";

// App state constants (only two of these are really needed/used).
const STATE_CREATE = "state-create";
const STATE_READ = "state-read";
const STATE_UPDATE = "state-update";
const STATE_DELETE = "state-delete";

// Keep track of app state (currently not used/needed)
let currentState = STATE_CREATE;

/**
 * All the things start here :)
 */
window.addEventListener('DOMContentLoaded', (event) => {
    console.log("DOC ::: DOMContentLoaded");

    // Set up form buttons
    const btnCreate = document.body.querySelector('#btn-create');
    btnCreate.addEventListener('click', createClickHandler);

    const btnClear = document.body.querySelector('#btn-clear');
    btnClear.addEventListener('click', clearClickHandler);

    const btnUpdate = document.body.querySelector('#btn-update');
    btnUpdate.addEventListener('click', updateClickHandler);

    const btnCancel = document.body.querySelector('#btn-cancel');
    btnCancel.addEventListener('click', cancelClickHandler);

    // Get things going by putting the app in the 'create' state.
    clearForm();
    setButtonState(STATE_CREATE);
    // Fetch initial data and display it.
    getBooksAsync().then(showBooks);

});

/**
 * Event handler for the 'create book' (submit) button.
 *
 * @param {*} event The button click event.
 */
function createClickHandler(event) {
    console.log("DOC ::: createClickHandler");
    event.preventDefault();
    const isValid = validateForm();
    console.log(' - is valid:', isValid);

    if (isValid) {
        const book = getFormData();
        console.log(' - add book:', book);
        // Add new book, then show new list of books.
        addBookAsync(book).then(showBooks);
        clearForm();
    } else {
        bootbox.alert({ title: "Add Book:", message: "Missing required input." });
    }
}

/**
 * Event handler for the 'clear' button. 
 * Resets the form input fields to their initial values by calling `clearForm()`.
 *
 * @param {*} event The button click event.
 */
function clearClickHandler(event) {
    console.log("DOC ::: clearClickHandler");
    event.preventDefault();
    const t = event.target;
    clearForm();
}

/**
 * Event handler for the 'update book' button.
 *
 * @param {*} event The button click event.
 */
function updateClickHandler(event) {
    console.log("DOC ::: updateClickHandler");
    event.preventDefault();
    const isValid = validateForm();
    console.log(' - is valid:', isValid);

    if (isValid) {
        const book = getFormData();
        console.log(' - update book:', book);
        // Update books and display result (new list of books)
        updateBookAsync(book).then(showBooks);
        setButtonState(STATE_CREATE);
        clearForm();
    } else {
        bootbox.alert({ title: "Update Book:", message: "Missing required input." });
    }
}

/**
 * Event handler for the 'cancel update' button.
 * Kicks the app from `update` state back into `create` state.
 *
 * @param {*} event The button click event.
 */
function cancelClickHandler(event) {
    console.log("DOC ::: cancelClickHandler");
    event.preventDefault();
    setButtonState(STATE_CREATE);
    clearForm();
}

/**
 * Does exactly what it says on the tin.
 */
function clearForm() {
    console.log("DOC ::: clearForm");

    // * As there is no real `<form>` element, all input fields have to be reset directly.
    // ? May refactor this to use `querySelectorAll()` and loop over them.

    const frm = document.body.querySelector('#form-container');

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

/**
 *
 *
 * @returns boolean
 */
function validateForm() {
    console.log("DOC ::: validateForm");
    let isValid = true;
    // Only grab required input 'type=text' fields. Grab required number input fields separately
    const fields = document.body.querySelectorAll('input[type="text"][required]');
    console.log(' - input fields:', fields);
    const len = fields.length;
    for (let i = 0; i < len; i++) {
        const f = fields[i];
        const v = f.value.trim();
        if (v == "") {
            isValid = false;
            break;
        }
    }
    const numField = document.body.querySelector('input[type="number"][required]');
    const numValue = parseFloat(numField.value);
    // console.log(' - not a number:', isNaN(numValue));

    if (isNaN(numValue) || numValue == 0) {
        isValid = false;
    }
    return isValid;
}

/**
 * Gathers all form data and returns it as a plain vanilla object.
 *
 * @returns form data as vanilla object
 */
function getFormData() {
    console.log("DOC ::: getFormData");

    const fid = document.body.querySelector('input[name="book-id"]');
    const fTitle = document.body.querySelector('input[name="book-title"]');
    const fAuthor = document.body.querySelector('input[name="book-author"]');
    const fPub = document.body.querySelector('input[name="book-pub"]');
    const fPrice = document.body.querySelector('input[name="book-price"]');

    const bookId = fid.value.trim();
    const bookTitle = fTitle.value.trim();
    const bookAuthor = fAuthor.value.trim();
    const bookPub = fPub.value.trim();
    const bookPrice = parseFloat(fPrice.value);

    const book = {
        id: bookId,
        title: bookTitle,
        author: bookAuthor,
        publisher: bookPub,
        price: bookPrice
    }
    console.log(' - book:', book);
    return book;
}

/**
 * Switches form buttons (show/hide) depending on app state.
 * 
 * @param {*} state The state to which to switch.
 */
function setButtonState(state) {
    console.log("DOC ::: setButtonState");
    console.log(' - state:', state);

    const subTitle = document.body.querySelector('#sub-title');

    const btnCreate = document.body.querySelector('#btn-create');
    const btnClear = document.body.querySelector('#btn-clear');

    const btnUpdate = document.body.querySelector('#btn-update');
    const btnCancel = document.body.querySelector('#btn-cancel');

    if (state === STATE_CREATE) {
        subTitle.innerText = "Add Book";
        // hide 'update' and 'cancel' buttons
        btnUpdate.classList.add('btn-hide');
        btnCancel.classList.add('btn-hide');
        // show 'create' and 'clear' buttons
        btnCreate.classList.remove('btn-hide');
        btnClear.classList.remove('btn-hide');
    } else if (state == STATE_UPDATE) {
        subTitle.innerText = "Update Book";
        // show 'update' and 'cancel' buttons
        btnUpdate.classList.remove('btn-hide');
        btnCancel.classList.remove('btn-hide');
        // hide 'create' and 'clear' buttons
        btnCreate.classList.add('btn-hide');
        btnClear.classList.add('btn-hide');
    }

}

/**
 * Displays books data. 
 * Each book entry is added to an existing `<table>`, which is first cleared.
 * 
 * @param {*} books The list of books to display.
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
        // 'edit' and 'delete' buttons for table row
        let btns = clone.querySelectorAll('button');
        // all cells for table row
        let tds = clone.querySelectorAll('td');
        // console.log('tds:', tds);
        // TODO: Tempted to refactor table template with string literals.
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
 * Event handler for 'edit book' button.
 * Fills out the form with the selected book data and
 * switches the app state to 'update'.
 * 
 * @param {*} event 
 */
function editBookClickHandler(event) {
    console.log("DOC ::: editBookClickHandler");

    // Use currentTarget to avoid getting child node(s), e.g. the button icon.
    const t = event.currentTarget;
    console.log(' - target:', t);

    const inp = t.parentNode.querySelector('input');
    console.log(' - input:', inp);

    const val = inp.value;
    const data = JSON.parse(val);
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

    setButtonState(STATE_UPDATE);

}

/**
 * Event handler for the 'delete book' button.
 * Asks for user confirmation before removal.
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
                // Remove selected book.
                deleteBookAsync(data).then(showBooks);
                // Reset form (in case the removed book was displayed)
                clearForm();
                // Go back to 'Add Book' state
                setButtonState(STATE_CREATE);
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
 * @returns {Promise} List of books when Promise is resolved.
 */
async function getBooksAsync() {
    console.log("DOC ::: getBooksAsync");
    let response = await fetch(BOOKS_READ_URL);
    let books = await response.json();
    console.log(' - books:', books);
    return books;
}

/**
 * Adds book.
 * Data is sent to PHP script which writes data to file.
 *
 * @param {*} book The new book data to add.
 * @returns {Promise} List of books when Promise is resolved.
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
 * @returns {Promise} Promise The new list of books when resolved.
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
    const books = await response.json();
    return books;
}

/**
 * Deletes a book from the list of books.
 *
 * @param {*} json The book to be removed, as JSON formatted string.
 * @returns {Promise} List of books when Promise is resolved.
 */
async function deleteBookAsync(json) {
    console.log("DOC ::: deleteBookAsync");
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