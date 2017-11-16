<?php
$servername = "gaborjuhasz.co.uk.mysql";
$username = "gaborjuhasz_co_uk_gusto";
$database = "gaborjuhasz_co_uk_gusto";
$password = "@Kakamaki12";

// Create connection
try {
    $conn = new PDO("mysql:host=$servername;dbname=gaborjuhasz_co_uk_gusto", $username, $password);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    //echo "Connected successfully"; 
    }
catch(PDOException $e)
    {
    echo "Connection failed: " . $e->getMessage();
    }
?>