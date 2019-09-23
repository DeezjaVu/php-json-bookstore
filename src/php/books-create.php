<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

define("BOOKS_URL", "../data/books.json");

// Read JSON file
$books = file_get_contents(BOOKS_URL);

// Decode received data
$data = json_decode(file_get_contents("php://input"));

// Create unique id for new data entry
$data->id = uniqid();

// Decode existing books and add new book at the beginning of the list.
$jbooks = json_decode($books);
array_unshift($jbooks, $data);

// Encode back to json and write to file.
$books = json_encode($jbooks);
file_put_contents(BOOKS_URL, $books);

// Return the new data
echo $books;

exit;
