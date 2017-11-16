<?php
//include 'connection.php';
header("Access-Control-Allow-Origin: *");
 $con=mysqli_connect("gaborjuhasz.co.uk.mysql","gaborjuhasz_co_uk_survey_pen","fikusz","gaborjuhasz_co_uk_survey_pen");

    if (mysqli_connect_errno())
      {
      echo "error";
      }


    // Function for the details form

    
    $name = $_GET['name'];
    $email = $_GET['email'];
    
     
    
    //echo "<br>".$_SESSION['userName']."<br>";
    //echo $_SESSION['userEmail'];
    
    
    
    // the SQL to save name and email
    $sql = mysqli_query($con,"INSERT INTO users (U_Name,U_Email)
        VALUE ('$name','$email')");
    
    
    //use exec() because no results are returned
    //$conn->exec($sql);
    
    // We need the id of the person as well for later
    $last_id = mysqli_query($con, "SELECT LAST_INSERT_ID()" );
    //print_r($last_id);
    
    if($last_id){
        
        foreach ($last_id as $value) {
            
            
            
            //print_r($value);
            
            foreach ($value as $key => $userId) {
                
                //echo $key . ' contains ' . $numberOfUsers . '<br/>';
                
                echo($userId);
                
            }
        }
        
        
    } else { echo "error";}
    
    
    
    //$id = $conn->insert_id;
    //$_SESSION['userId'] = $last_id;
    
    // redirect the page to start the survey
    //header('Location:http://localhost/survey/pages/page1.php ');
    /*if($sql){
        
	echo "true";
        
    } else { echo "error";}*/
// Function for question q1
if (isset($_POST['submit-q1'])){
    
    $answer = $_POST['treatment'];
    $id = $_SESSION['userId'];
    $q_id = $_POST['q-id'];
    
    $sql = "INSERT INTO answer (Q_Id,U_ID, answer)
        VALUE ($q_id,$id,'$answer')";
    
    //execute the sql
    $conn->exec($sql);
    //echo $_SESSION['userName'].$gender;
    if ($q_id == 1){
        header('Location:http://localhost/survey/pages/page3.php ');
    } else if ($q_id == 3){
        header('Location:http://localhost/survey/pages/page5.php ');
    } else if ($q_id == 4){
        header('Location:http://localhost/survey/pages/page6.php ');
    }
}



?>