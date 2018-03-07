<?php
	session_start();
	if (!(isset($_SESSION['User']))){
	  $_SESSION['lastpage']= 'calendar.php';
	  //redirect to login page if no session information
	  header('Location: login.php');
	}
	//print_r($_POST);
	$succmsg = '';
	include_once 'database_HW6F17.php';
	//Create connection
	$conn=new mysqli($db_servername,$db_username,$db_password,$db_name,$db_port);
	if ( $conn->connect_error ) {
	$errormsg.="Failed to connect with database";
	}
	//Add a user
	$errormsgadd = '';
	if(array_key_exists('Add_User',$_POST)){
		//echo 'name: '.$_POST['name'].'loginname: '.$_POST['loginName'];
		if(empty($_POST['name'])){
			$errormsgadd .= "Please enter a valid value for User Name field<br>";
		}
		if(empty($_POST['loginName'])){
			$errormsgadd .= "Please enter a valid value for User Login field<br>";
		}
		else{
			$sql = "SELECT * FROM tbl_accounts WHERE acc_login = '".$_POST['loginName']."'";
			$result = mysqli_query($conn, $sql);
			if(mysqli_num_rows($result)>0){
				$errormsgadd .= "This login is used by another user<br>";
			}
		}
		if(empty($_POST['password'])){
			$errormsgadd .= "Please enter a valid value for Password field<br>";
		}
		if($errormsgadd == ""){
			$sql = "INSERT INTO tbl_accounts (acc_name, acc_login, acc_password) VALUES ('".$_POST['name']."', '".$_POST['loginName']."', '". sha1($_POST['password'])."')";
			mysqli_query($conn, $sql);
			$succmsg .= "Account added successfully";
		}
	}
	//Delete user
	if(preg_grep("/^Delete*/", $_POST)){
		//echo 'Delete mode';
		foreach($_POST as $key=>$value){
			if(preg_match("/^Delete*/", $key)){
				$id = strtok($key, "_");
				$id = strtok("");
				//echo $id;
				$sql = "DELETE FROM tbl_accounts WHERE acc_id = '".$id."'";
				mysqli_query($conn, $sql);
			}
		}
		$succmsg .= "Account deleted successfully";
	}
	//Edit user
	if(preg_grep("/^Edit*/", $_POST)){
		//echo 'Delete mode';
		foreach($_POST as $key=>$value){
			if(preg_match("/^Edit*/", $key)){
				$editid = strtok($key, "_");
				$editid = strtok("");
				//echo $editid;
			}
		}
		$succmsg .= "Account editing mode";
	}
	//Cancel the Editing
	if(array_key_exists('Cancel',$_POST)){
			$succmsg .= "Account editing canceled";
		}

	//Update an account
	$errormsgedit = '';
	if(preg_grep("/^Update*/", $_POST)){
		//echo 'Delete mode';
		foreach($_POST as $key=>$value){
			if(preg_match("/^Update*/", $key)){
				$updateid = strtok($key, "_");
				$updateid = strtok("");
				//echo $updateid;
			}
		}
		if(empty($_POST['editName'])){
			$errormsgedit .= "Please enter a valid value for User Name field<br>";
		}
		if(empty($_POST['editLogin'])){
			$errormsgedit .= "Please enter a valid value for User Login field<br>";
		}
		else{
			$sql = "SELECT * FROM tbl_accounts WHERE acc_id <> '".$updateid."' and acc_login = '".$_POST['editLogin']."'";
			$result = mysqli_query($conn, $sql);
			if(mysqli_num_rows($result)>0){
				$errormsgedit .= "This login is used by another user<br>";
			}
		}
		if(empty($_POST['editPassword'])){
			$errormsgedit .= "Please enter a value for Password field<br>";
		}
		if($errormsgedit == ""){
			$sql = "UPDATE tbl_accounts SET acc_name ='".$_POST['editName']."',acc_login ='".$_POST['editLogin']."',acc_password ='".sha1($_POST['editPassword'])."' WHERE acc_id = '".$updateid."';";
			mysqli_query($conn, $sql);
			$succmsg .= "Account updated";
		}
		else{
			$editid = $updateid;
		}
	}
	//Show a list of Users
	$sql = "SELECT acc_id,acc_name,acc_login,acc_password FROM tbl_accounts";
	$results = mysqli_query($conn, $sql);
	$show_list = '';
	if (mysqli_num_rows($results) == 0){
		$show_list .= '<p>There is no user now, add new user with the form below.</p>';
	}
	else {
		$show_list .= '<thead><tr><th>ID</th><th>Name</th><th>Login</th>
		<th>New Password</th><th>Action</th><tr></thead>';
		// output data of each row
		while($row = $results-> fetch_assoc()){
			if(isset($editid) && $editid == $row["acc_id"]){
				$show_list .= '<tr><td>'.$row["acc_id"].'</td>';
				$show_list .= '<td><input type="text" name="editName" value = "'.$row["acc_name"].'" ></td>';
				$show_list .= '<td><input type="text" name="editLogin" value = "'.$row["acc_login"].'"></td>';
				$show_list .= '<td><input type="text" name="editPassword" value = ""></td>';
				$show_list .= '<td><input type="submit" name="Update_'.$row["acc_id"].'" value="Update"> ';
				$show_list .= '<input type="submit" name="Cancel" value="Cancel" ></td><tr>';
			}else{
				$show_list .= '<tr><td>'.$row["acc_id"].'</td><td>'.$row["acc_name"].'</td><td>'.$row["acc_login"];
				$show_list .= '</td><td></td><td><input type="submit" name="Edit_'.$row["acc_id"].'" value="Edit"> ';
				$show_list .= '<input type="submit" name="Delete_'.$row["acc_id"].'" value="Delete" ></td><tr>';
			}
		}
	}
	mysqli_close($conn);
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset = "utf-8">
	<title>Admission</title>
	<link rel="stylesheet" type="text/css" href="style.css">
	<script type="text/javascript">
  	function Redirect() {
      window.location="logout.php";
    }
	</script>
</head>
  <body>
		<h1>Admission</h1>
			<?php
				echo 'Welcome '.$_SESSION['User'].'<br>';
			?>
			<button onclick="Redirect()">Logout</button>
			<br>
  	<nav>
  		<a href="calendar.php">My Calendar</a> |
  		<a href="input.php">Form input</a> |
			<a href="admin.php">Admission</a>
  	</nav>
    <p>This page is protected from the public, and you can see a list of all users defined in the database</p>
		<div class = "form">
			<form method="post" action = "admin.php">
      <h2>List of Users</h2>
			<div class = "error">
				<?php
					echo $errormsgedit;
				?>
			</div>
			<?php
				echo $succmsg;
			?>
				<table id = 'userlist'>
					<?php
						echo $show_list;
					?>
				</table>
	      <h2>Add New Users</h2>
					<div class = "error">
						<?php
							echo $errormsgadd;
						?>
					</div>
	      <table>
		      <tr>
						<td>Name</td>
						<td><input type="text" name="name" value = ""></td>
					</tr>
					<tr>
						<td>Login</td>
						<td><input type="text" name="loginName" value = ""></td>
					</tr>
					<tr>
						<td>Password</td>
						<td><input type="text" name="password" value = ""></td>
					</tr>
	        <tr>
	          <td><input type="submit" name="Add_User" value="Add User"></td>
	        </tr>
	    </form>
		</div>
	</body>
</html>
