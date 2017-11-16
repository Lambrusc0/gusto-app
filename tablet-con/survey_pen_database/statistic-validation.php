<?php 

    header("Access-Control-Allow-Origin: *");
    $con=mysqli_connect("gaborjuhasz.co.uk.mysql","gaborjuhasz_co_uk_survey_pen","fikusz","gaborjuhasz_co_uk_survey_pen");


    $males;
    $females;
    $users;

    if (mysqli_connect_errno())
      {
      echo "error";
      }

    $sql = mysqli_query($con,"SELECT COUNT(u_id) AS user_id FROM users");
    
    
    if($sql){
        
        foreach ($sql as $value) {
            
            //$users = json_encode($value);
            foreach ($value as $key => $user) {
                
                
                $v = (int)$user;
                $users = json_encode($v);
                
            }
        }
        
        
    } else { echo "error";}
    
    $sql = mysqli_query($con,"SELECT COUNT(answer) AS male FROM answer WHERE answer = 'male'");
    
     if($sql){
        
        foreach ($sql as $value) {
            
            //$males = json_encode($value);
            //echo $males;
            
            foreach ($value as $key => $male) {
                
                
                
                $v = (int)$male;
                $males = json_encode($v);
                
            }
        }
        
        
    } else { echo "error";}
    
    
    $sql = mysqli_query($con,"SELECT COUNT(answer) AS female FROM answer WHERE answer = 'female'");
    
     if($sql){
        
        foreach ($sql as $value) {
            
            //$females = json_encode($value);
            foreach ($value as $key => $female) {
                
                
                $v = (int)$female;
                $females = json_encode($v);
                
            }
        }
        
        
    } else { echo "error";}
    
    
    
    $under18 = 0;
    $to30 = 0;
    $to50 = 0;
    $to80 = 0;
    $over80 = 0;
    
    $sql = "SELECT answer FROM answer WHERE Q_Id = 2 ";
    $results = mysqli_query($con, $sql);
    
    
    
    $answerNumber = mysqli_num_rows($results);
    
    //var_dump($results);
    
    while ($row = mysqli_fetch_array($results, MYSQLI_NUM)) {
        if($row[0]<=18){
            $under18++;
        } else if ($row[0]>=19 && $row[0]<=30) {
            $to30++;
        } else if ($row[0]>=31 && $row[0]<=50) {
            $to50++;
        } else if ($row[0]>=51 && $row[0]<=80) {
            $to80++;
        } else if ($row[0]>=81) {
            $over80++;
        }
    }
    
    
    //----------------------------------------------------------------------------------------------//
    
    
    $daily = 0;
    $often = 0;
    $weekly = 0;
    $monthly = 0;
    $rarely = 0;
    $never = 0;
    
    $sql = "SELECT answer FROM answer WHERE Q_Id = 3 ";
    $results = mysqli_query($con, $sql);
    
    
    
    //var_dump($results);
    
    while ($row = mysqli_fetch_array($results, MYSQLI_NUM)) {
        if($row[0]=="daily"){
            $daily++;
        } else if ($row[0]=="often") {
            $often++;
        } else if ($row[0]=="weekly") {
            $weekly++;
        } else if ($row[0]=="monthly") {
            $monthly++;
        } else if ($row[0]=="rarely") {
            $rarely++;
        } else if($row[0]=="never"){
            $never++;
        }
    }
    
    //-----------------------------------------------------------------------------------------------//
    
    
    $twitter = 0;
    $facebook = 0;
    $tumblr = 0;
    $youtube = 0;
    
    
    $sql = "SELECT SUM(points) AS facebookPoints FROM sortable WHERE answer = 'facebook' ";
    $result = mysqli_query($con, $sql);
    
    while ($row = $result->fetch_assoc()) {
    $facebook = $row['facebookPoints'];
    }
    
 
    
    $sql = "SELECT SUM(points) AS twitterPoints FROM sortable WHERE answer = 'twitter' ";
    $result = mysqli_query($con, $sql);
    
    while ($row = $result->fetch_assoc()) {
    $twitter = $row['twitterPoints'];
    }
    
    
    $sql = "SELECT SUM(points) AS tumblrPoints FROM sortable WHERE answer = 'tumblr' ";
    $result = mysqli_query($con, $sql);
    
    while ($row = $result->fetch_assoc()) {
    $tumblr = $row['tumblrPoints'];
    }
    
    
    $sql = "SELECT SUM(points) AS youtubePoints FROM sortable WHERE answer = 'youtube' ";
    $result = mysqli_query($con, $sql);
    
    while ($row = $result->fetch_assoc()) {
    $youtube = $row['youtubePoints'];
    }
    
    
    
    $arr = array();
    
    array_push($arr, "$males", "$females", "$users", "$under18", "$to30", "$to50", "$to80", "$over80", "$daily", "$often", "$weekly", "$monthly", "$rarely", "$never", "$twitter", "$facebook", "$tumblr", "$youtube" );
    
    echo json_encode($arr);

?>