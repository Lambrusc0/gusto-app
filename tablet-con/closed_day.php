<?php 
header("Access-Control-Allow-Origin: *");
include 'conn.php';

$companyId = $_POST['companyId'];
$cash = $_POST['cash'];
$amex = $_POST['amex'];
$otherCard = $_POST['other'];
$serviceCharge = $_POST['serviceCharge'];
$subtotal = $_POST['subtotal'];
$total = $_POST['total'];
$customers = $_POST['customers'];
$tableServed = $_POST['tableNumber'];
$closedDate = $_POST['serevedDate'];

//echo "comp id: ".$companyId.", cash: ".$cash.", amex: ".$amex.", other: ".$otherCard.", serice: ".$serviceCharge.", sub: ".$subtotal.", total:".$total.", cutomers: ".$customers.", tables: ".$tableServed.", date: ".$closedDate;

    $stmt = $conn->prepare('INSERT INTO closed_day(company_id, cash, amex, other_card, service_charge, subtotal, total, customers, table_served, closed_date)
                            VALUES(:company_id, :cash, :amex, :other_card, :service_charge, :subtotal, :total, :customers, :table_served, :closed_date)');
    $stmt-> execute(array(':company_id'=>$companyId,
                         ':cash'=>$cash,
                         ':amex'=>$amex,
                         ':other_card'=>$otherCard,
                         ':service_charge'=>$serviceCharge,
                         ':subtotal'=>$subtotal,
                         ':total'=>$total,
                         ':customers'=>$customers,
                         ':table_served'=>$tableServed,
                         ':closed_date'=>$closedDate));
    // NEED TO SORT OUT THE DATE closed_date

?>
