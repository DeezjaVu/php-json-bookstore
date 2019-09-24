<?php

define("BOOKS_URL", "../data/books.json");

// Read JSON file
$json = file_get_contents(BOOKS_URL);

// Decode json to PHP data type.
$books = json_decode($json);

// Decode received data.
$data = json_decode(file_get_contents("php://input"));

// Search and remove the existing book with matching id.
foreach ($books as $key => $value) {
    if ($value->id == $data->id) {
        // echo "found matching book -> value: ", $value -> id, " key: ", $key;
        // unset($books[$key]);
        array_splice($books, $key, 1);
        break;
    }
}

// Add the updated book at the beginning.
array_unshift($books, $data);

// Encode back to json and write to file.
$jbooks = json_encode($books);
file_put_contents(BOOKS_URL, $jbooks);

// Adjust header to output JSON data.
header('Content-Type: application/json');

// Return the new json data.
echo $jbooks;

exit;
