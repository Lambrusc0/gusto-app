<?php 

    header("Access-Control-Allow-Origin: *");
    $con=mysqli_connect("gaborjuhasz.co.uk.mysql","gaborjuhasz_co_uk_survey_pen","fikusz","gaborjuhasz_co_uk_survey_pen");

    $q_id = $_GET['q_id'];
    $data = $_GET['data'];
    $u_id = $_GET['u_id'];

    echo $q_id." and ".$data;

    if (mysqli_connect_errno())
      {
      echo "error";
      }

    $sql = mysqli_query($con,"INSERT INTO answer (q_id,u_id,answer) VALUE ($q_id,$u_id,'$data')");
    

?>