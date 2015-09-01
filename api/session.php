<?php


//Configuration parameters
$databasename = 'ventureevolution';
$hostname = 'localhost';
$username = 'root';
$password = 'Perdex128';

//Functions


//STEP 1: Determine request type
$conn = new mysqli($hostname, $username, $password, $databasename);
$response = '';
$expiryTime = 3600; //expiry in seconds
$requestType = $_GET['request'];

//STEP 2: Run request
//IF request = initialize

runBase();

function runBase(){
	
	global $conn, $response, $requestType;
	
	if($requestType == 'initialize'){

		if (mysqli_connect_errno())
		{
			$response = array('result' => 'error', 'output'=>"Failed to connect to MySQL: ".mysqli_connect_error());
			echo json_encode($response,JSON_NUMERIC_CHECK);
			
			return;
		}

		//Check for first time run to create the tables
		if(checkFirstTimeRun()){
			runCreateTable();
		}

		//Write $secretKey to MYSQL
		$theSecretKey = generateSecretKey();

		if($theSecretKey == ''){
			//Print error response
			$response = array('result' => 'error', 'output'=>'unable to generate secret key');
			echo json_encode($response,JSON_NUMERIC_CHECK);
			
			return;
		}else{
			//Print secret key
			$response = array('result' => 'success', 'output'=>$theSecretKey);
			echo json_encode($response,JSON_NUMERIC_CHECK);
			
			return;
		}
	}
	//IF request = save
	elseif($requestType == 'save'){

		if(checkRealConnection()){
		
			$currentFirstName = $_POST['firstname'];
			$currentCompany = $_POST['company'];
			$currentCSV = $_POST['csv'];
			try{
				$conn->query("INSERT INTO csvStored (firstname, company, csvData, createDateTime) VALUES ('".$currentFirstName."','".$currentCompany."','".$currentCSV."','".date('Y-m-d H:i:s')."')");
			}catch (Exception $e){
				$response = array('result' => 'error', 'output'=>$e->getMessage());
				echo json_encode($response,JSON_NUMERIC_CHECK);
			}
		}
	}
}

//FUNCTIONS

function checkFirstTimeRun(){

	global $conn;
	
	$val = mysqli_query($conn,"SELECT * FROM Session;");
	
	if($val){
		return FALSE;
	}else{
		return TRUE;
	}
	
}

function runCreateTable(){

	global $conn;
	
	try {
		$conn->query("CREATE TABLE Session (sid int NOT NULL AUTO_INCREMENT, secretKey VARCHAR(16) UNIQUE, ipaddress VARCHAR(40), createdDateTime DATETIME NOT NULL, PRIMARY KEY (sid))");

		$conn->query("CREATE TABLE csvStored (cid int NOT NULL AUTO_INCREMENT, firstname VARCHAR(120) NOT NULL, company VARCHAR(120) NOT NULL, csvData BLOB, createdDateTime DATETIME NOT NULL, PRIMARY KEY (cid));");
		
	}catch (Exception $e){
		$response = array('result' => 'error', 'output'=>$e->getMessage());
		echo json_encode($response,JSON_NUMERIC_CHECK);
	}
	
}

function generateSecretKey(){

	global $conn;
	
	$secretKey = '';
	$secretKeyLength = 16;
	$characters = 'qwertyuiopasdfghjklzxcvbnm1234567890QWERTYUIOPASDFGHJKLZXCVBNM';
	
	$breakGeneration = TRUE;
	$breakCounter = 0;
	$breakCounterLimit = 10;
	

	while($breakGeneration){
		//Generate random 16 char KEY

		for ($i = 0; $i < $secretKeyLength; $i++) {
			$secretKey .= $characters[rand(0, strlen($characters) - 1)];
		}
		
		//Check if exist
		$result = mysqli_query($conn,"SELECT cid FROM Session WHERE secretKey = '".$secretKey."';");
		
		//Create only if the key doesn't already exist
		$countRow = mysqli_num_rows($result);
		
		if($countRow == 0){
			$breakGeneration = FALSE;
			$result = mysqli_query($conn,"INSERT INTO Session (secretKey, ipaddress, createdDateTime) VALUES ('".$secretKey."','".get_client_ip()."','".date('Y-m-d H:i:s')."');");
		}else{
			$secretKey = '';
		}
		
		//If try for too many times break
		if($breakCounter >= $breakCounterLimit){
			$breakGeneration = FALSE;
		}
		
		$breakCounter++;
	}
	
	return $secretKey;
}

function get_client_ip() {
    $ipaddress = '';
    if (getenv('HTTP_CLIENT_IP'))
        $ipaddress = getenv('HTTP_CLIENT_IP');
    else if(getenv('HTTP_X_FORWARDED_FOR'))
        $ipaddress = getenv('HTTP_X_FORWARDED_FOR');
    else if(getenv('HTTP_X_FORWARDED'))
        $ipaddress = getenv('HTTP_X_FORWARDED');
    else if(getenv('HTTP_FORWARDED_FOR'))
        $ipaddress = getenv('HTTP_FORWARDED_FOR');
    else if(getenv('HTTP_FORWARDED'))
       $ipaddress = getenv('HTTP_FORWARDED');
    else if(getenv('REMOTE_ADDR'))
        $ipaddress = getenv('REMOTE_ADDR');
    else
        $ipaddress = 'UNKNOWN';
    return $ipaddress;
}

function checkRealConnection(){

	global $conn,$expiryTime;
	
	$count = 0;
	$onlyFirst = 1;
	
	//Check if exist
	$timeExpiry = date("Y-m-d H:i:s", time() - $expiryTime);
	
	$result = mysqli_query($conn,"SELECT cid FROM Session WHERE secretKey = '".$secretKey."' AND createdDateTime > '".$timeExpiry."';");
	
	while(($row = mysqli_fetch_assoc($result)) && $count < $onlyFirst){
		if($row['cid'] != ''){
			return $row['cid'];
		}
		$count++;
	}
	
}
?>