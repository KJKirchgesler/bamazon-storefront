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

//variable storing MySQL query to display all the items in the products table
var query = 'SELECT * FROM products';

//Connects to the database and the query variable pulls the information from the products table to display to the user
	connection.query(query, function(err, data) {
		if (err) throw err;

	//Creates the table to display the data from the MySQL database
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

  //Formats the table so that it can be displayed to the customer 
	console.log(table.toString());

  //Calls the function to initiate the prompts to make a purchase
  purchaseItems();

  })
}

displayInventory();

//Function that allows customer to select item ID and quantity of desired purchase
function purchaseItems() {

    //Asks the customer to enter the ID of the product to be purchased.
    inquirer.prompt([{
            name: "itemId",
            type: "input",
            message: "Please enter the ID number of the product that you would like to purchase.",
            //validates to make sure the customer is entering a valid ID number
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
            //validates to make sure the customer is entering a valid quantity
            validate: function(value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return false;
                }
            }

        //returns the customer's selections and stores them in a couple of variables
        }]).then(function(answer) {
            var item = answer.itemId;
            var quantity = answer.quantity;

            //Runs the MySQL query based on the customer's selections
            var selectQuery = 'SELECT * FROM products WHERE ?';
                connection.query(selectQuery, {item_id: item}, function(err, data){
                  //Returns an error message if the customer makes an invalid entry
                  if(err) console.log(err, "ERROR: That Item ID does not exist. Please select a valid Item ID.");

                  //Generates an error message if the customer hits enter without entering anything
                  if (data.length === 0) {
                    console.log("ERROR: That Item ID does not exist. Please select a valid Item ID.");
                    displayInventory();

                  //Grabs the selected item if the user enters a valid ID number
                  } else {
                    var selectedItem = data[0];


                //This message occurs if there is enough stock available to fulfill the customer's order
                if (quantity <= selectedItem.stock_quantity) {
                console.log("Congratulations! The product that you ordered is in stock. Processing your order....");

                //The inventory is updated accordingly and the customer receives a confirmation
                var updateQuery = 'UPDATE products SET stock_quantity = ' + (selectedItem.stock_quantity - quantity) + ' WHERE item_id = ' + item;
                  connection.query(updateQuery, function(err, data) {
                  if (err) throw err;

                  console.log("Your order has been placed. Your total is $" + selectedItem.price * quantity);
                  console.log("Thank you for shopping with us!");

                  }) 

                  //Otherwise, the customer receives this message and is prompted to re-submit the order with modifications
                  } else {
                  console.log("Sorry, we don't have enough items in stock, please modify your order.");
                  displayInventory();

        }
      }
    })
  })
}



               