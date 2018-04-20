//Import required dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

// Vreate the connection information for the MySQL database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  //Username
  user: "root",

  //Password
  password: "",
  database: "bamazon"
});

//Function to display the inventory table to customers
function displayInventory() {

	var query = 'SELECT * FROM products';

	connection.query(query, function(err, data) {
		if (err) throw err;

	//Creates a table to display the data from the MySQL database
	var table = new Table({
		head: ['Item Id#', 'Product Name', 'Price'],
		style: {
			head: ['blue'],
			compact: false,
			colAligns: ['center'],
		}
	});

	//Loops through each record in the MySQL database and pushes that data into a new row in the table
	for(var i = 0; i < data.length; i++){
		table.push(
			[data[i].item_id, data[i].product_name, data[i].price]
		);
	}
	console.log(table.toString());

});

}
displayInventory();