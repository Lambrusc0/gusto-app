<?php
//header('Location:http://localhost/survey/index.php');


    header("Access-Control-Allow-Origin: *");
    $con=mysqli_connect("gaborjuhasz.co.uk.mysql","gaborjuhasz_co_uk_survey_pen","fikusz","gaborjuhasz_co_uk_survey_pen");


$order = 0;

    $q_id = $_GET['q_id'];
    $u_id = $_GET['u_id'];

echo $data;

$media;

$points = 5;
if (is_array($_GET['media'])){
// foreach loop to go through the array with the sortable data in it
    foreach($_GET['media'] as $media => $value){
            
        $points--;
            // each row will have a number
            $row[0] = $value;
        if ($row[0] == 1){
            // if the number in the row is 1 than it is twitter
            $social = 'twitter';
            // becouse it is the first sortable item it gets 4 point etc.
            
        } else if ($row[0] == 2){
            $social = 'facebook';
            
        } else if ($row[0] == 3){
            $social = 'tumblr';
            
        } else if($row[0] == 4){
            $social = 'youtube';
            
        }
        echo "true";
        $sql = mysqli_query($con, "INSERT INTO sortable (q_id,u_id, answer, points) VALUE ($q_id,$u_id,'$social', $points)");
    }
}
//$sql = mysqli_query($con, "INSERT INTO sortable (q_id,u_id, answer, points) VALUE ($q_id,$u_id,'$social', $points)");



?>