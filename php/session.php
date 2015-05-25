<?php


//Configuration parameters
$databasename = 'ventureevolution';
$hostname = 'localhost';
$username = '';
$password = '';

//Functions

function generateRandomString($length = 16) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

//Initialize

//STEP 1: Determine request type
$requestType = $_GET['request'];

//STEP 2: Run request
//IF request = initialize
if($requestType == 'initialize'){
	
	//Connect to database
	$conn = new mysqli($servername, $username, $password, $databasename);
	
}
//IF request = save
elseif($requestType == 'save'){
	
	//Connect to database
	$conn = new mysqli($servername, $username, $password, $databasename);
	
}

?>