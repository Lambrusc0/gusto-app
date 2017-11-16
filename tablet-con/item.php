<?php 
header("Access-Control-Allow-Origin: *");
include 'conn.php';

$rowid = $_POST['rowid'];
$tableRowid = $_POST['tableRowid'];
$companyId = $_POST['companyId'];
$tableId = $_POST['tableId'];
$userId = $_POST['userId'];
$itemId = $_POST['itemId'];

    
    $stmt = $conn->prepare('INSERT INTO order_item(rowid, table_rowid, table_id, user_id, item_id, company_id)
                            VALUES(:rowid, :table_rowid, :table_id, :user_id, :item_id, :company_id)');
    $stmt-> execute(array(':rowid'=>$rowid,
                         ':table_rowid'=>$tableRowid,
                         ':table_id'=>$tableId,
                         ':user_id'=>$userId,
                         ':item_id'=>$itemId,
                         ':company_id'=>$companyId));
    




?>