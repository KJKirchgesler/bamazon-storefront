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
		head: ['Item Id', 'Product Name', 'Price'],
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
  purchaseItems();

  })
}

displayInventory();

	function purchaseItems() {
    inquirer.prompt([{
            name: "itemId",
            type: "input",
            message: "Please enter the ID number of the product that you would like to purchase.",
            validate: function(value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return false;
                }
            }
        }, 

        {
            name: "quantity",
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
            var item = answer.itemId;
            var quantity = answer.quantity;

        
            var selectQuery = 'SELECT * FROM products WHERE ?';
                connection.query(selectQuery, {item_id: item}, function(err, data){
                  if(err) console.log(err, "ERROR: That Item ID does not exist. Please select a valid Item ID.");

                  if (data.length === 0) {
                    console.log("ERROR: That Item ID does not exist. Please select a valid Item ID.");
                    displayInventory();

                  } else {
                    var selectedItem = data[0];


           
                if (quantity <= selectedItem.stock_quantity) {
                console.log("Congratulations! The product that you ordered is in stock. Processing your order....");


                var updateQuery = 'UPDATE products SET stock_quantity = ' + (selectedItem.stock_quantity - quantity) + ' WHERE item_id = ' + item;
                  connection.query(updateQuery, function(err, data) {
                  if (err) throw err;

                  console.log("Your order has been placed. Your total is $" + selectedItem.price * quantity);
                  console.log("Thank you for shopping with us!");

                  }) 

                  } else {
                  console.log("Sorry, we don't have enough items in stock, please modify your order.");
                  displayInventory();

        }
      }
    })
  })
}



               