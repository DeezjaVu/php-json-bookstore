<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header('Access-Control-Allow-Origin: *');

define("BOOKS_URL", "../data/books.json");

// Read JSON file.
$books = file_get_contents(BOOKS_URL);

// Adjust header to output JSON data.
// header('Content-Type: application/json');

echo $books;

exit;
