<?php

define("BOOKS_URL", "../data/books.json");

// Read JSON file
$json = file_get_contents(BOOKS_URL);
// Decode books json to PHP data
$books = json_decode($json);

// Decode received data
$data = json_decode(file_get_contents("php://input"));

foreach ($books as $key => $value) {
    if($value -> id == $data -> id){
        // echo "found matching book -> value: ", $value -> id, " key: ", $key;
        array_splice($books, $key, 1);
        break;
    }
}

print_r($books);

$jbooks = json_encode($books);

print_r($jbooks);

exit;

