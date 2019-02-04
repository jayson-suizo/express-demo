const express = require("express");
const Joi = require("joi");
const mysql = require("mysql");

const connection = mysql.createConnection({
	//properties
	host: "192.168.9.14",
	user: "root",
	password: "admin",
	database: "node-express"

});

connection.connect(function(error) {
	if(!!error) {
		console.log("problem in db connection");
	}else {
		console.log("Connected!!");
	}
});

app = express();

app.use(express.json());

const courses = [
	{id: 1, name: "course1"},
	{id: 2, name: "course2"},
	{id: 3, name: "course3"},
];

app.get("/", (req, res) => {
	connection.query("SELECT * FROM test", function(error, rows, fields){
		if(!!error) {
			console.log("Error in the query");
		} else {
			if(rows.length > 0) {
				res.send({success:true,data: rows});
			}else {
				res.send({success: false, error: "no data available"});
			}
		}
	});
});

app.get("/api/courses", (req, res) => {
	res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
	//res.send(req.params.id);
	const course = courses.find(c => c.id === parseInt(req.params.id));
	
	if(!course) return res.status(404).send("The course with the given id was not found");
	res.send(course);
});

app.post("/api/courses", (req, res) => {
	
	const { error } = validateCourse(req.body); // result.error

	if(error) return res.status(400).send(error["details"][0].message);

	const course = {
			id:courses.length + 1, 
			name: req.body.name
		};
	courses.push(course);
	res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
	//res.send(req.params.id);
	const course = courses.find(c => c.id === parseInt(req.params.id));
	
	if(!course) return res.status(404).send("The course with the given id was not found");
		

	const { error } = validateCourse(req.body); // result.error

	if(error) return res.status(400).send(error["details"][0].message);

	course.name = req.body.name;
	res.send(course);
});

app.delete("/api/courses/:id", (req, res) => {
	//res.send(req.params.id);
	const course = courses.find(c => c.id === parseInt(req.params.id));
	
	if(!course) return res.status(404).send("The course with the given id was not found");

	const index = courses.indexOf(course);
	courses.splice(index,1);

	res.send(course);
});


app.get("/api/posts/:year/:month", (req, res) => {
	//res.send(req.params);
	res.send(req.query);
});


function validateCourse(course) {
	const schema =  {
		name: Joi.string().min(3).required(),
	};

	return Joi.validate(course,schema);
}

//PORT
const port = process.env.PORT || 3000;


app.listen(port,() => console.log(`lisening to port ${port}`));
