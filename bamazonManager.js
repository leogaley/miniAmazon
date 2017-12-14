var inquirer = require("inquirer");
var mysql = require("mysql");
require("console.table");
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'NYUDuck',
  database : 'bamazon'
});
var items = [];
var departments = [];
connection.connect();

//get departments to use as options when adding a new item
getDepartmentArray();

function menuOptions() {

	inquirer.prompt([
	{
		type:'list',
		name:'task',
		message:'\nManager View: Please make a selection.\n',
		choices: ['VIEW PRODUCTS FOR SALE','VIEW LOW INVENTORY','ADD TO INVENTORY','ADD NEW PRODUCT','EXIT'] 
	}

	]).then(function (input) {
		//routing
		switch (input.task) {
		case 'VIEW PRODUCTS FOR SALE':
			viewAllInventory();
			break;
		case 'VIEW LOW INVENTORY':
			viewLowInventory();
			break;
		case 'ADD TO INVENTORY':
			addInventory();
			break;
		case 'ADD NEW PRODUCT':
			addProduct();
			break;
		case 'EXIT':
			process.exit();
		default:
			viewAllInventory();
		}
	});
};

function viewAllInventory(){
	connection.query('SELECT * FROM products;', function (error, results, fields) {
		console.table(results);
		menuOptions();
	})
	
	
};

function viewLowInventory(){
	connection.query('SELECT product_name, price, stock_quantity FROM products WHERE stock_quantity < 5;', function (error, results, fields) {
		console.table(results);
		menuOptions();
	})
	
};

function addInventory() {
	inquirer.prompt([
	{
		type:'list',
		name:'item',
		message:'Please select an item',
		choices: items //array
	},
	{
		type:'input',
		name:'quantity',
		message:'Please enter the quantity to add.',
		//parse into integer but allow (in case of a float).  Still must be a number according to validateNumber function
		filter: function(quantity){
			return parseInt(quantity);
		},
		validate : validateNumber
	}
	]).then(function (input) {
		var item = input.item;
		var quantity = input.quantity;

		var sqlQuery = "UPDATE products SET stock_quantity = stock_quantity + ? WHERE product_name = ?;";
		var data = [quantity, item];
		//update database
		connection.query(sqlQuery,data,function(error,results,fields){
			if (error) throw error;
			console.log('Inventory added');
			menuOptions();
		})
	});
};


function addProduct() {
	inquirer.prompt([
	{
		type:'input',
		name:'itemName',
		message:'Please enter a name for the item',
	},
	{
		type:'input',
		name:'initialQuantity',
		message:'Please enter an initial quantity',
		filter: function(quantity){
			return parseInt(quantity);
		},
		validate: validateNumber
	},
	{
		type:'input',
		name:'price',
		message:'Please enter item price',
		filter: function(price){
			return parseFloat(price).toFixed(2);
		},
		validate: validateNumber
	},
	{
		type:'list',
		name:'department',
		message:'Please select department',
		choices: departments
	}
	]).then(function (input) {
		var itemName = input.itemName;
		var quantity = input.initialQuantity;
		var price = input.price;
		var department = input.department;
		var data = [itemName,department,quantity,price];
		var sqlQuery = 'INSERT INTO products (product_name,department_name,stock_quantity,price) VALUES (?,?,?,?);';
		//add product to database, pass in query as string, item data as array.  
		connection.query(sqlQuery,data,function(error,results,fields){
			if (error) throw error;
			console.log('\nItem ' + input.itemName + ' added to database.\n');
			menuOptions();
		})

	});

};

//get items for use as choices when adding inventory
function getItemArray() {
	//var items = [];
	connection.query('SELECT product_name FROM products WHERE stock_quantity > 0', function (error, results, fields) {
  		if (error) throw error;
 		
 		for (i=0;i<results.length;i++){
 			items.push(results[i].product_name);
 		}
 		//done gathering data, start the app	
 		menuOptions();
 		
 	});
}

//get departments for use as choices when modifying inventory
function getDepartmentArray(){
	connection.query('SELECT department_name FROM departments;', function (error, results, fields) {
  		if (error) throw error;
 	
 		for (i=0;i<results.length;i++){
 			departments.push(results[i].department_name);
 		}	
 		getItemArray();
 		
 	});
}

//if its a number, return true.  otherwise return the string (which halts the user)
function validateNumber (quantity){
	return !isNaN(parseInt(quantity)) || 'Must be a number';

}
