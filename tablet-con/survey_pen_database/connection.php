<?php
$servername = "gaborjuhasz.co.uk.mysql";
$username = "gaborjuhasz_co_uk_survey_pen";
$password = "fikusz";


try {
    $conn = new PDO("mysql:host=$servername;dbname=gaborjuhasz_co_uk_survey_pen", $username, $password);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // This is just to try out if everything is working and connected
    //$sql = "INSERT INTO users (U_Name)
       //VALUE ('Gabor')";
    
    
    // use exec() because no results are returned
    //$conn->exec($sql);
    echo "Connected successfully"; 
    }
catch(PDOException $e)
    {
    echo "Connection failed: " . $e->getMessage();
    }




?>