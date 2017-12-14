var inquirer = require("inquirer");
var mysql = require("mysql");
//connect to local database
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'NYUDuck',
  database : 'bamazon'
});

connection.connect();

//get item list for first input
getItemArray();

//gather order information
function placeOrder(items) {

	console.log('Hello, thanks for visiting Mini Amazon!');
	inquirer.prompt([
	{
		type:'list',
		name:'item',
		message:'What item would you like to buy?',
		choices: items 
	},
	{
		type:'input',
		name:'quantity',
		message:'What quantity would you like to buy?',
		//validate quantity as a number
		validate: validateQuantity
	},
	{
		type:'input',
		name:'name',
		message:'What is your name?',
	},
	]).then(function (input) {
		getDatabaseInfo(input.item,parseInt(input.quantity),input.name);
	});

} 

function getItemArray() {
	var items = [];
	//get all products from database
	connection.query('SELECT product_name FROM products WHERE stock_quantity > 0', function (error, results, fields) {
  		if (error) throw error;
 		
 		
 		for (i=0;i<results.length;i++){
 			items.push(results[i].product_name);
 		}	
 		//return items array to placeOrder function
 		//I am still uncomfortable with async because it smells to me to have to call the placeOrder function from here.  I do understand the reason to do it like this.  
 		placeOrder(items);
 	});
}

//get other info about the item ordered (price, deparment, current quantity)
function getDatabaseInfo(item,quantity,name) {
	var department;
	var price;
	var currentQuantity;
	connection.query('SELECT department_name,price,stock_quantity FROM products WHERE product_name = ?',item, function (error, results, fields) {
	  	if (error) throw error;
	  	department = results[0].department_name;
	  	price = results[0].price;
	  	currentQuantity = results[0].stock_quantity;
	  	//return error if not enough in stock
	  	if(quantity >= currentQuantity){
	  		console.log('Sorry, only ' + results[0].stock_quantity + ' available.  Please place order for lower quantity or different item.');
	  		//basically, make user start order process over
	  		getItemArray();
	  	}
	  	else {
	  		var newQuantity = currentQuantity - quantity;
	  		//this actually can run async - can move on to submitOrder without waiting
	  		updateAvailableQuantity(item,newQuantity);
	  		submitOrder(item,department,price,quantity,name);
	  	}  	
	});
}

function updateAvailableQuantity(item,quantity){
	var updateData = [quantity,item];
	//update stock quantity, pass in array of variables
	connection.query('UPDATE products SET stock_quantity = ? WHERE product_name = ?',updateData,function(error,results,fields){
		if (error) throw error;

	})
}

//write order to DB
function submitOrder(item,department,price,quantity,name) {
	
	var sqlQuery = "INSERT INTO orders (product_name,department_name,price,quantity,customer_name) VALUES(?,?,?,?,?);";
	var order = [item, department, price, quantity,name];
		
	connection.query(sqlQuery,order,function(error,results,fields){
		if (error) throw error;

		console.log('Order #' + results.insertId + ' placed for $' + price*quantity);

		connection.end();
	})
}

function validateQuantity (quantity){
	return !isNaN(parseInt(quantity)) || 'Order quantity must be a number';

}
