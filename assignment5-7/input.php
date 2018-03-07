<?php
	//validate user
	session_start();
	if (!(isset($_SESSION['User']))){
		$_SESSION['lastpage']= 'input.php';
		//redirect to login page if no session information
		header('Location: login.php');
	}
	//Validation and information processing
	$errormsg = "";
	function sortWithSt($e1,$e2){
		echo "<br>first event:";
		print_r($e1);
		echo $e1['startTime'];
		echo "<br>second event:";
		print_r($e2);
		echo $e2['startTime'];
		if ($e1['startTime'] == $e2['startTime'] )
		return 0;
  	return ($e1['startTime'] < $e2['startTime'])?-1:1;
	}
	if(!empty($_POST)){
		if(array_key_exists('Clear',$_POST)){
			unlink("event.txt");
			header('Location: calendar.php');
		}
		else{
			if(empty($_POST['eventname'])){
				$errormsg .= "Please provide a value for Event Name <br>";
			}else if(!preg_match("/^[a-zA-Z0-9\s]+$/",$_POST['eventname'])){
				$errormsg .= "Event Name must be alphanumeric<br>";
			}
			if(empty($_POST["starttime"])){
				$errormsg .= "Please provide a value for Start Time <br>";
			}
			if(empty($_POST["endtime"])){
				$errormsg .= "Please provide a value for End Time <br>";
			}
			if(empty($_POST["location"])){
				$errormsg .= "Please provide a value for Location <br>";
			}else if(!preg_match("/^[a-zA-Z0-9\s]+$/",$_POST['location'])){
				$errormsg .= "Location must be alphanumeric.";
			}
			if($errormsg == ""){
				$myfile = fopen("event.txt","r");
				chmod("event.txt", 0666);
				$events = file_get_contents("event.txt");
				fclose($myfile);
				$events = json_decode($events,true);
				if(!isset($events)){
					$events = array();
				}
				if(!isset($events[$_POST['day']])){
					$events[$_POST['day']] = array();
				}
				$newevent = array();
				$newevent ['eventName'] = $_POST['eventname'];
				$newevent ['startTime'] = $_POST['starttime'];
				$newevent ['endTime'] = $_POST['endtime'];
				$newevent ['location'] = $_POST['location'];
				$events[$_POST['day']][] = $newevent;
				echo "event of a day before sort";
				print_r($events[$_POST['day']]);
				usort($events[$_POST['day']],"sortWithSt");
				echo "<br>event of a day after sort";
				print_r($events[$_POST['day']]);
				$events = json_encode($events);
				$myfile = fopen("event.txt","w");
				fwrite($myfile,$events);
				fclose($myfile);
				header('Location: calendar.php');
			}
		}
	}
 ?>

<!DOCTYPE html>
<html>
<head>
	<meta charset = "utf-8">
	<title>Calendar Input</title>
	<link rel="stylesheet" type="text/css" href="style.css">
	<script src="javascript.js"></script>
	<script type="text/javascript">
  	function Redirect() {
      window.location="logout.php";
    }
	</script>
</head>
<body>
	<div class = "float_left">
		<?php
			echo 'Welcome '.$_SESSION['User'].'<br>';
		?>
		<button onclick="Redirect()">Logout</button>
	</div>
	<h1>Calendar Input</h1>
	<nav>
		<a href="calendar.php">My Calendar</a> |
		<a href="input.php">Form input</a> |
		<a href="admin.php">Admission</a>
	</nav>
	<div class = "form">
		<form name = "myform" method="post" action = "">
      <table class = "form">
        <div class = "error">
          <?php echo $errormsg;?>
        </div>
	      <tr>
					<td>Event Name</td>
					<td><input type="text" name="eventname" value = ""></td>
				</tr>
				<tr>
					<td>Start Time</td>
					<td><input type="time" name="starttime" value = ""></td>
				</tr>
				<tr>
					<td>End Time</td>
					<td><input type="time" name="endtime" value = ""></td>
				</tr>
				<tr>
					<td>Location</td>
					<td><input type="text" name="location" value = ""></td>
				</tr>
				<tr>
					<td>Day of the week</td>
					<td>
						<select name="day">
							<option value="Mon">Mon</option>
							<option value="Tue">Tue</option>
							<option value="Wed">Wed</option>
							<option value="Thur">Thur</option>
							<option value="Fri">Fri</option>
						</select>
					</td>
				</tr>
				<tr>
					<td><input type="submit" name="Clear" value="Clear"></td>
					<td><input type="submit" name="Submit" value="Submit"></td>
				</tr>
			</table>
    </form>
	</div>
</body>
</html>
