// http is a core module provided by Node.js
// it is required if the application involves server and client
// more details can be found at: https://nodejs.org/api/http.html
const http = require('http');

// file system is a core module provided by Node.js
// more details can be found at: https://nodejs.org/api/fs.html
const fs = require('fs');

// local host
const hostname = '127.0.0.1';

// port on which server runs
const port = 9000;


// createServer method creates the http server
// req, res objects are created automatically by Node.js
const httpServer = http.createServer(function (req, res) {
	switch(req.method) {

		case 'GET':
      // request for the home page
			if(req.url === '/') {
				getHomePage(req, res);
			}

      else if(req.url === '/addCourse.html') {
        // request for addCourse page
				getAddCoursePage(req, res);
			} else {
        // request for an unknown page
				get404(req, res);
			}
      break;

		case 'POST':
			if(req.url === '/postCourse') {
				var reqBody = '';
				// server starts receiving the form data
				req.on('data', function(data) {
					reqBody += data;

				});
				// server has received all the form data
				req.on('end', function() {
					addCourseFunction(req, res, reqBody);
				});
			}
			break;
		default:
      // method not supported
			get405(req, res);
			break;
	}
});


httpServer.listen(port, hostname, function(){
	console.log('Server started on port', port);
});

// TO DO: YOU NEED TO COMPLETE THIS FUNCTION
// function to return the addCourse.html page back to the client
function getAddCoursePage(req, res) {
  // TO DO: Complete this function to return the addCourse.html page developed by you
  // TO DO: The returned status code should be 200
  // Hint: Use the readFile method of fs module
	fs.readFile('addCourse.html',function(err,html){
		if(err){
			throw err;
		}
		res.statusCode = 200;
		res.setHeader('Content-type','text/html');
		res.write(html);
		res.end();
	});
}

// TO DO: YOU NEED TO COMPLETE THIS FUNCTION
// function to return the 404 page back to the client
function get404(req, res) {
  // TO DO: Complete this function to return the 404.html page provided with the assignment
  // TO DO: The returned status code should be 404
	fs.readFile('404.html',function(err,html){
		if(err){
			throw err;
		}
		res.statusCode = 404;
		res.setHeader('Content-type','text/html');
		res.write(html);
		res.end();
	});
}

// TO DO: YOU NEED TO COMPLETE THIS FUNCTION
// function to return the 405 page back to the client
function get405(req, res) {
  // TO DO: Complete this function to return the 405.html page provided with the assignment
  // TO DO: The returned status code should be 405
	fs.readFile('405.html',function(err,html){
		if(err){
			throw err;
		}
		res.statusCode = 405;
		res.setHeader('Content-type','text/html');
		res.write(html);
		res.end();
	});
}


// TO DO: YOU NEED TO COMPLETE THIS FUNCTION
// function to add a new course to course.json file
// sample reqBody: courseId=a&coursetitle=a&coursecredit=a&courseterm=a&courseId=a
function addCourseFunction(req, res, reqBody) {
  // TO DO: Complete this function to add a new course to the course.json file.
  // TO DO: After successful addition of the new course, redirect the user to the home page.
  // TO DO: The status code associated with re-direction is 302
	fs.readFile('course.json',function(err,content){
		if(err){
			throw err;
		}
		//console.log('request Body', reqBody);
		var parsePost = reqBody.split("=");
    var id = parsePost[1].split("&");
		id = id[0].replace("+"," ");
		var title = parsePost[2].split("&");
		title = title[0].replace("+"," ");
		var credit = parsePost[3].split("&");
		credit = credit[0].replace("+"," ");
		var term = parsePost[4].split("&");
		term = term[0].replace("+"," ");
		var instructor = parsePost[5].split("&");
		instructor = instructor[0].replace("+"," ");
		instructor = instructor.replace("%2C",",");
		// console.log('id: ', id);
		// console.log('title: ', title);
		// console.log('credit: ', credit);
		// console.log('term: ', term);
		console.log('instructor: ', instructor);
		 var newcourse = {
		 	"courseId": id,
		 	"courseTitle": title,
		 	"courseCredit": credit,
		 	"courseTerm": term,
		 	"courseInstructor": instructor
		 }
		var parseJson = JSON.parse(content);
		parseJson['courseList'][parseJson['courseList'].length] = newcourse;
		var writeJson = JSON.stringify(parseJson);
		//console.log('ready to update: ', writeJson);
		fs.writeFile('course.json',writeJson,function(err) {
	    if(err) {
	        return console.log(err);
    }});
		res.statusCode = 302;
		res.writeHead(302, {'Location': '/'});
		res.end();
	});
}

// function to dynamically generate the home page by reading the contents of course.json file
function getHomePage(req, res) {
  // read the contents of the course.json file
	fs.readFile('course.json', function(err, content) {
  		if(err) {
  			throw err;
  		}
  		var parseJson = JSON.parse(content);
      // generate the html content
  		var tableData = '';
  		tableData += '<thead>';
  		tableData += '<tr>';
  		tableData += '<th>';
  		tableData += 'Id';
  		tableData += '</th>';
  		tableData += '<th>';
  		tableData += 'Title';
  		tableData += '</th>';
  		tableData += '<th>';
  		tableData += 'Credit';
  		tableData += '</th>';
  		tableData += '<th>';
  		tableData += 'Term';
  		tableData += '</th>';
  		tableData += '<th>';
  		tableData += 'Instructor';
  		tableData += '</th>';
  		tableData += '</tr>';
  		tableData += '</thead>';
  		tableData += '<tbody>';
  		for (var i = 0; i < parseJson['courseList'].length; i++) {
  			tableData += '<tr>'

  			tableData += '<td>'
  			tableData += parseJson['courseList'][i].courseId;
  			tableData += '</td>'

  			tableData += '<td>'
  			tableData += parseJson['courseList'][i].courseTitle;
  			tableData += '</td>'

  			tableData += '<td>'
  			tableData += parseJson['courseList'][i].courseCredit;
  			tableData += '</td>'

  			tableData += '<td>'
  			tableData += parseJson['courseList'][i].courseTerm;
  			tableData += '</td>'

  			tableData += '<td>'
  			tableData += parseJson['courseList'][i].courseInstructor;
  			tableData += '</td>'

    		tableData += '</tr>'

		}
		tableData += '</tbody>';
		var html =
		'<!doctype html>' +
		'<html lang="en">' +
  		'<head>' +
    	'<meta charset="utf-8">' +
    	'<meta name="viewport" content="width=device-width, initial-scale=1">' +
	    '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">' +
	    '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>' +
	    '<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>' +
	    '<link rel="stylesheet" href="css/style.css">' +
	    '<script type="text/javascript" src="js/script.js"></script>' +
	    '<title>Spring 18 Course Offering</title>' +
  		'</head>' +
  		'<body>' +
   		'<nav class="navbar navbar-default">' +
     	'<div class="container-fluid">' +
      	'<ul class="nav navbar-nav">' +
        '<li><a href="/"><b>Spring 18 Course Offering</b></a></li>' +
        '<li><a href="addCourse.html"><b>Add Course</b></a></li>' +
      	'</ul>' +
    	'</div>' +
  		'</nav>' +
  		'<div class="container">' +
  		'<table class="table">' +
  		tableData +
  		'</table>' +
  		'</div>' +
  		'</body>' +
		'</html>';

		res.statusCode = 200;
		res.setHeader('Content-type', 'text/html');
		res.write(html);
		res.end();
	});
}
