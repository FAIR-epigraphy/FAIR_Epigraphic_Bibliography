<?php

header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Credentials: true');
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Content-Type: application/json; charset=UTF-8");

ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


$servername = "xxxxxxx";
$username = "xxxxxxx";
$password = "xxxxxxxxxx";
$dbname = "xxxxxxxxxxxx";

//header('Access-Control-Allow-Origin: *');

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);

// Check connection
if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}
//else
//{
//  echo "Connection Success";
//}

?>
