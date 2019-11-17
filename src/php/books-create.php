<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Origin: *");

define("BOOKS_URL", "../data/books.json");

// Read JSON file
$json = file_get_contents(BOOKS_URL);

// Decode received data
$data = json_decode(file_get_contents("php://input"));

// Create unique id for new data entry
// $data['id'] = new stdClass();
$data->id = uniqid();

// Decode existing books and add new book at the beginning of the list.
$books = json_decode($json);
array_unshift($books, $data);

// Encode back to json and write to file.
$jbooks = json_encode($books);
file_put_contents(BOOKS_URL, $jbooks);

// Return the new json data
echo $jbooks;

exit;
