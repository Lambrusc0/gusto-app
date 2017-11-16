<?php 
header("Access-Control-Allow-Origin: *");
include 'conn.php';

$rowid = $_POST['rowid'];
$companyId = $_POST['companyId'];
$tableNumber = $_POST['tableNumber'];
$userId = $_POST['userId'];
$customerNumber = $_POST['customerNumber'];
$payment = $_POST['payment'];
$total = $_POST['total'];
$subtotal = $_POST['subtotal'];
$serviceCharge = $_POST['serviceCharge'];
$opendate = $_POST['opendate'];


    
    $stmt = $conn->prepare('INSERT INTO open_table(company_id, user_id, rowid, customer_number, payment, total, subtotal, service_charge, open_date)
                            VALUES(:company_id, :userId, :rowid, :customer_number, :payment, :total, :subtotal, :service_charge, :open_date)');
    $stmt-> execute(array(':company_id'=>$companyId,
                         ':userId'=>$userId,
                         ':rowid'=>$rowid,
                         ':customer_number'=>$customerNumber,
                         ':payment'=>$payment,
                         ':total'=>$total,
                         ':subtotal'=>$subtotal,
                         ':service_charge'=>$serviceCharge,
                         ':open_date'=>$opendate));
 



?>