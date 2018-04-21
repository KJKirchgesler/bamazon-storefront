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

function purchaseItems() {

	inquirer.prompt([{
            name: "item_id",
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
            name: "stock_quantity",
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
        var itemId = answer.item_id - 1
        var selectedItem = data[itemId]
        var quantity = answer.stock_quantity
           
           if (quantity < selectedItem.stock_quantity) {
               console.log("Your total for " + "(" + answer.stock_quantity + ")" + " - " + selectedItem.product_name + " is: " + selectedItem.price * quantity);
               
               var query = 'UPDATE products SET ? WHERE ?';
               connection.query(query, [{
                    stock_quantity: selectedItem.stock_quantity - quantity
                }, 

                {
                    id: selectedItem.id
                }], function(err, data) {
                    //console.log(err);
                    purchaseItems();
                });

            } else {
                console.log("Sorry, insufficient Quanity at this time. All we have is " + selectedItem.stock_quantity + " in our Inventory.");
                purchaseItems();
            }
        })
    }
//}

purchaseItems();