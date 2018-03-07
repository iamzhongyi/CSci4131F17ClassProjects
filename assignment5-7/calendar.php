<?php
	session_start();
	if (!(isset($_SESSION['User']))){
		$_SESSION['lastpage']= 'calendar.php';
		//redirect to login page if no session information
		header('Location: login.php');
	}
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset = "utf-8">
	<title>My Calendar</title>
	<link rel="stylesheet" type="text/css" href="style.css">
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
    <h1>My Calendar</h1>
  	<nav>
  		<a href="calendar.php">My Calendar</a> |
  		<a href="input.php">Form input</a> |
			<a href="admin.php">Admission</a>
  	</nav>
    <br>
		<div id = "calendar">
			<table id = cTable>
				<tbody>
			<?php
				echo "<table id = cTable>";
				if(file_exists("event.txt")){
					$myfile = fopen("event.txt","r");
					$events = file_get_contents("event.txt");
					$events = json_decode($events,true);
					fclose($myfile);
					if(!isset($events)){
						exit();
					}
					$days = array("Mon","Tue","Wed","Thur","Fri");
					for ($i=0; $i < 5; $i++) {
						$day = $days[$i];
						if(isset($events[$day])){
							echo '<tr><td class = day><span>';
							echo $day;
							echo '</span></td>';
							foreach ($events[$day] as $dayevent) {
								// build the data element.
								echo '<td><span>';
								echo $dayevent['startTime'];
								echo '-';
								echo $dayevent['endTime'];
								echo '</span><br>';
								echo $dayevent['eventName'];
								echo '-<span class = "loc">';
								echo $dayevent['location'];
								echo '</span></td>';
							}
							echo '</tr>';
						}
					}
					echo "</table>";
				}
				else{
						echo '<div class = "centertext"> Calendar has no events, creat with form. </div>';
				}
			?>
		</div>
    <div class = "form">
      <form>
  			<p>
  				Search:
  				<input id = 'radius' name = 'radius' type = 'text'/>
  				<button type='button' id = "findr">Find Nearby Resturants</button>
  			</p>
      </form>
    </div>
		<div id= 'map'><p>here is place for map</p></div>
    <div class = "centertext"><p>This page hase been tested in Chrome and Internet Exploer</p></div>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDvP0MnvvcoAECd4t4JMyY1KWh-z14PRxo&callback=initMap&libraries=places,visualization" async defer></script>
		<script src="mapjs.js"></script>
	</body>
</html>
