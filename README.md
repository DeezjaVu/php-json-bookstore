# PHP CRUD Bookstore

Combining PHP and JavaScript for a CRUD bookstore.

To make it easier for others to try this project, I decided to do away with the MySQL part and replaced it with a simple  `json` data structure. 

## Install

Once you have cloned or downloaded the repository, copy the contents of the `src` folder to your PHP server and open the `index-js.html` file in your browser via `localhost`.

If you're familiar with [Apache Ant](https://ant.apache.org/), there's a `build.xml` script in the `desktop` and `laptop` folders that you can adjust to your needs to facilitate copying the `src` folder to the PHP server destination folder.

## The Code

This is a simple Bookstore `CRUD` application that allows you to administer book entries stored in a `json` file.