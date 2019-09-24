<?php

define("BOOKS_URL", "../data/books.json");

// Read JSON file.
$json = file_get_contents(BOOKS_URL);
// Decode books json to PHP data.
$books = json_decode($json);

// Decode received data
$data = json_decode(file_get_contents("php://input"));

foreach ($books as $key => $value) {
    if($value -> id == $data -> id){
        // echo "found matching book -> value: ", $value -> id, " key: ", $key;
        // unset($books[$key]);
        array_splice($books, $key, 1);
        break;
    }
}

// Encode back to json and write to file.
$jbooks = json_encode($books);
file_put_contents(BOOKS_URL, $jbooks);


// Adjust header to output JSON data.
header('Content-Type: application/json');

echo $jbooks;

exit;
