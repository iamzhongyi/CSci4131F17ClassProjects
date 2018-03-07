<?php
session_start();
//print_r($_POST);
//print_r($_SESSION);
//validation of username and password field
$errormsg = "";
if(!empty($_POST)){
	if(empty($_POST['username'])){
		$errormsg .= "Please enter a valid value for User Login field<br>";
	}
	if(empty($_POST['password'])){
		$errormsg .= "Please enter a valid value for Password field<br>";
	}
	if($errormsg == ""){
		$password = sha1($_POST['password']);
		$username = (string)$_POST['username'];
		//print_r($username);
		include_once 'database_HW6F17.php';
		//Create connection
		$conn=new mysqli($db_servername,$db_username,$db_password,$db_name,$db_port);
		if ( $conn->connect_error ) {
		$errormsg.="Failed to connect with database";
		}
		else {
			//echo "<br>Start reading table";
			$sql = "SELECT acc_id,acc_name,acc_login,acc_password FROM tbl_accounts WHERE acc_login = '$username'";
			$result = mysqli_query($conn, $sql);
			if (mysqli_num_rows($result) > 0) {
				// output data of each row
			  $row = mysqli_fetch_assoc($result);
				//echo "id: " . $row["acc_id"]. " - Name: " . $row["acc_name"]. "- Login name" . $row["acc_login"]. "- Password" .$row["acc_password"]."<br>";
				if(!($row["acc_password"] == $password)){

					$errormsg.="Password is incorrect. Pleasw check the password and try again.";
				}
				else{
					$_SESSION["User"] = $row["acc_name"];
					//print_r($_SESSION);
					if(array_key_exists('lastpage',$_SESSION)){
					 	header('Location:'.$_SESSION['lastpage']);
					}
					else {
						header('Location: calendar.php');
					}
				}
			}
			else {
					$errormsg.="User does not exist. Pleasw check the login details and try again.";
			}
			mysqli_close($conn);
		}
	}
}
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset = "utf-8">
	<title>Login page</title>
	<link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
  <h1>Login Page</h1>
  <div class = "form">
    <div class = "error">
      <?php echo $errormsg;?>
    </div>
    <p>Please enter your user's login name and password. Both Values are case sensitive</p>
    <form name = "myform" method="post" action = "">
      <table class = "form">
        <tr>
          <td>Login</td>
          <td><input type="text" name="username" value = ""></td>
        </tr>
        <tr>
          <td>Password</td>
          <td><input type="text" name="password" value = ""></td>
        </tr>
      </table>
			<input type="submit" name="Submit" value="Submit">
    </form>
  </div>
</body>
</html>
