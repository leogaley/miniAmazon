var inquirer = require("inquirer");
var mysql = require("mysql");
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'NYUDuck',
  database : 'bamazon'
});

connection.connect();

getItemArray();


function placeOrder(items) {

	console.log('Hello, thanks for visiting Mini Amazon!');
	inquirer.prompt([
	{
		type:'list',
		name:'item',
		message:'What item would you like to buy?',
		choices: items //SQL/NPM return item list
	},
	{
		type:'input',
		name:'quantity',
		message:'What quantity would you like to buy?',
	},
	{
		type:'input',
		name:'name',
		message:'What is your name?',
	},

	]).then(function (input) {

		getDatabaseInfo(input.item,input.quantity,input.name);
		
	
	});

} 



function getItemArray() {
	var items = [];
	connection.query('SELECT product_name FROM products WHERE stock_quantity > 0', function (error, results, fields) {
  		if (error) throw error;
 		
 		
 		for (i=0;i<results.length;i++){
 			items.push(results[i].product_name);
 			//console.log(results[i].product_name);
 		}	
 		
 		placeOrder(items);
 	});
}


function getDatabaseInfo(item,quantity,name) {
	//var sqlQuery = "INSERT INTO orders (product_name,department_name,price,quantity,customer_name) VALUES(?,'Sports',25,3,'Paul');";
	var department;
	var price;
	var currentQuantity;
	connection.query('SELECT department_name,price,stock_quantity FROM products WHERE product_name = ?',item, function (error, results, fields) {
	  	if (error) throw error;
	  	department = results[0].department_name;
	  	//console.log(department);
	  	price = results[0].price;
	  	currentQuantity = results[0].stock_quantity;
	  	if(quantity >= currentQuantity){
	  		console.log('Sorry, only ' + results[0].stock_quantity + ' available.  Please place order for lower quantity or different item.');
	  		getItemArray();
	  	}
	  	else {
	  		var newQuantity = currentQuantity - quantity;
	  		updateAvailableQuantity(item,newQuantity);
	  		submitOrder(item,department,price,quantity,name);
	  	}
	  	
	});
}

function updateAvailableQuantity(item,quantity){
	var updateData = [quantity,item];
	connection.query('UPDATE products SET stock_quantity = ? WHERE product_name = ?',updateData,function(error,results,fields){
		if (error) throw error;

	})
}

function submitOrder(item,department,price,quantity,name) {
	
	var sqlQuery = "INSERT INTO orders (product_name,department_name,price,quantity,customer_name) VALUES(?,?,?,?,?);";
	var order = [item, department, price, quantity,name];
		
	connection.query(sqlQuery,order,function(error,results,fields){
		if (error) throw error;

		console.log(results);
		connection.end();
	})
}

