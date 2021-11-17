"use strict";

var json1={}

function get_json1()
{
	// JSON object
	const data = {
		"name": "John Doe",
		"age": 22,
		"address": {
			"line1" : "1 Main St",
			"line2" : "",
			"city" : "Shrewsbury",
			"state" : "MA",
			"zip" : "01545"
		},
		"courses" : ["COMP.123", "COMP.456", "COMP.789", 123]
	}

	console.log(data.name); // John
	console.log(data.address);
	
	data.name = "Mike Smith";
	var nm = data["name"]
	var nm2 = data.name;
	console.log(data.name); // John
	console.log("nm: " + data.name); // John

}

function get_shape1()
{
	// JSON object
	const data = {
		"type": "line",
		"p1": {
			"x" : 100,
			"y" : 200,
		},
		"p2": {
			"x" : 200,
			"y" : 300,
		},
	}

	console.log(data.p1); 
	console.log(data.p2);
	
	console.log(data);


}

function get_shapes()
{
	// JSON object
	const data = 
	[
	{
		"type": "line",
		"p1": {
			"x" : 100,
			"y" : 200,
		},
		"p2": {
			"x" : 200,
			"y" : 300,
		},
	},
	{
		"type": "circle",
		"center": {
			"x" : 100,
			"y" : 200,
		},
		"radius": 50,
	},
	{
		"type": "rectangle",
		"p1": {
			"x" : 100,
			"y" : 200,
		},
		"p2": {
			"x" : 200,
			"y" : 300,
		},
	},
	{
		"type": "polygon",
		"points": [
		{
			"x" : 100,
			"y" : 200,
		},
		{
			"x" : 150,
			"y" : 250,
		},
		{
			"x" : 200,
			"y" : 300,
		},
		{
			"x" : 250,
			"y" : 350,
		},
		{
			"x" : 300,
			"y" : 400,
		},
		{
			"x" : 350,
			"y" : 450,
		},
		]
	},
	
	]

	
	console.log(data);
    for (let i = 0; i < data.length; i++) {
		console.log("Item#"+i);
		console.log(data[i]);
	}

}

function get_shapes2()
{
	// JSON object
	var shapes = [];
	
	const item1 = 
	{
		"type": "line",
		"p1": {
			"x" : 100,
			"y" : 200,
		},
		"p2": {
			"x" : 200,
			"y" : 300,
		},
	};
	
	const item2 = 
	{
		"type": "circle",
		"center": {
			"x" : 100,
			"y" : 200,
		},
		"radius": 50,
	};

	const item3 = 
	{
		"type": "rectangle",
		"p1": {
			"x" : 100,
			"y" : 200,
		},
		"p2": {
			"x" : 200,
			"y" : 300,
		},
	};

	const item4 = 
	{
		"type": "polygon",
		"points": [
		{
			"x" : 100,
			"y" : 200,
		},
		{
			"x" : 150,
			"y" : 250,
		},
		{
			"x" : 200,
			"y" : 300,
		},
		{
			"x" : 250,
			"y" : 350,
		},
		{
			"x" : 300,
			"y" : 400,
		},
		{
			"x" : 350,
			"y" : 450,
		},
		]
	};
	
	shapes.push(item1);
	shapes.push(item2);
	shapes.push(item3);
	shapes.push(item4);
	
	var l = shapes.length;
	console.log("No. of shapes: " + l);
    for (let i = 0; i < l; i++) {
		console.log("Shape#"+i);
		console.log(shapes[i]);
	}
	
	var last_shape = shapes.pop();
    console.log("last_shape: " + last_shape);
	last_shape = shapes.pop();
    console.log("last_shape2: " + last_shape);
	l = shapes.length;
	console.log("No. of shapes AFTER 2 pops: " + l);	
}


//get_json1();
//get_shape1();

//get_shapes();

get_shapes2();
