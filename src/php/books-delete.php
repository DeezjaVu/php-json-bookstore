<?php

define("BOOKS_URL", "../data/books.json");

// Read JSON file
$json = file_get_contents(BOOKS_URL);

// Adjust header to output JSON data
header('Content-Type: application/json');

echo $json;

exit;
