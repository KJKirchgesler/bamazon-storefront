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
function purchaseItems() {

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

	inquirer.prompt([{
            name: "selectID",
            type: "input",
            message: "Please enter the ID number of the item that you would like to purchase.",
            validate: function(value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return false;
                }
            }
        }, 

        {
            name: "howMany",
            type: "input",
            message: "How many items would you like to buy?",
            validate: function(value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return false;
                }
            }

        }]).then(function(answer) {
        var itemId = answer.selectID - 1
        var selectedItem = data[itemId]
        var quantity = answer.howMany
           
           if (quantity < selectedItem.stock_quantity) {
               console.log("Your purchase has been processed. Your total for " + "(" + answer.howMany + ")" + " - " + selectedItem.product_name + " is: " + selectedItem.price * quantity);
               
               var nextQuery = 'UPDATE products SET ? WHERE ?';
               connection.query(nextQuery, [{
                    stock_quantity: selectedItem.stock_quantity - quantity
                }, 

                {
                    id: selectedItem.id
                }], function(err, data) {
                    purchaseItems();
                });

            } else {
                console.log("Sorry, we have insufficient stock at this time. All we have is " + selectedItem.stock_quantity + " in our inventory.");
                purchaseItems();
            }
        })
    })
}

purchaseItems();