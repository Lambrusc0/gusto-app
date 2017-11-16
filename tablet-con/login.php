<?php 
header("Access-Control-Allow-Origin: *");
include 'conn.php'; 


    // Put the data from the form into variables
    $companyId = filterUserInput($_POST['companyId']);
    $userName = filterUserInput($_POST['uname']);
    $password = filterUserInput($_POST['password']);


    // Prepare the PDO connection
    $stmt = $conn->prepare("SELECT * FROM users WHERE company_id=:company_id && user_name=:user_name && user_password=:password && access=2");

    // Execute the array
    $stmt->execute(array(':company_id'=>$companyId,
                        ':user_name'=>$userName,
                        ':password'=>sha1($password)));

    // Fetch the data into a variable
    $data = $stmt->fetchALL(PDO::FETCH_ASSOC);


    
    if($data){
        //$data = json_encode($data);
        //echo $data;
        $stmt = $conn->prepare("SELECT user_id, user_name, access, user_position, app_code FROM users WHERE company_id=:company_id");
        $stmt->execute(array(':company_id'=>$companyId));
        $user = $stmt->fetchALL(PDO::FETCH_ASSOC);
        
        $stmt2 = $conn->prepare("SELECT category_name, category_id FROM category WHERE company_id=:company_id");
        $stmt2->execute(array(':company_id'=>$companyId));
        $category = $stmt2->fetchALL(PDO::FETCH_ASSOC);
        
        $stmt3 = $conn->prepare("SELECT item_name, item_id, category_id, item_price, item_description FROM item WHERE company_id=:company_id");
        $stmt3->execute(array(':company_id'=>$companyId));
        $item = $stmt3->fetchALL(PDO::FETCH_ASSOC);
        
        $stmt4 = $conn->prepare("SELECT VAT_number, service_charge, phone, message FROM advenced_settings WHERE company_id=:company_id");
        $stmt4->execute(array(':company_id'=>$companyId));
        $settings = $stmt4->fetchALL(PDO::FETCH_ASSOC);
        
        $stmt5 = $conn->prepare("SELECT company_name FROM company WHERE company_id=:company_id");
        $stmt5->execute(array(':company_id'=>$companyId));
        $company = $stmt5->fetchALL(PDO::FETCH_ASSOC);
        
        $userData = json_encode(array("category"=>array($category),
                                      "user"=>array($user),
                                      "item"=>array($item),
                                      "settings"=>array($settings),
                                      "company"=>array($company)
                               ));
        
        echo $userData;
        
    }else{
        echo false;
    }


    

    // This function is to filter all the input come from the form
    function filterUserInput($data) {

		// trim() function will remove whitespace from the beginning and end of string.
		$data = trim($data);

		// Strip HTML and PHP tags from a string
		$data = strip_tags($data);

		/* The stripslashes() function removes backslashes added by the addslashes() function.
			Tip: This function can be used to clean up data retrieved from a database or from an HTML form.*/
		$data = stripslashes($data);

		// htmlspecialchars() function converts special characters to HTML entities. Say '&' (ampersand) becomes '&amp;'
		$data = htmlspecialchars($data);
		return $data;

	} # End of filter_user_input function

?>