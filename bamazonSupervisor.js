var inquirer = require("inquirer");
var mysql = require("mysql");
//for displaying sql results in organized table in console. I THINK the reason this doesn't work when set as a variable (like var table = require...) has something to do with this being a method added to existing console object
require("console.table");
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'NYUDuck',
  database : 'bamazon'
});

connection.connect();

menuOptions();

function menuOptions() {

	inquirer.prompt([
	{
		type:'list',
		name:'task',
		message:'\nSupervisor View: Please make a selection.\n',
		choices: ['VIEW PRODUCT SALES BY DEPARTMENT','CREATE NEW DEPARTMENT','EXIT'] 
	}

	]).then(function (input) {
		//routing
		switch (input.task) {
		case 'VIEW PRODUCT SALES BY DEPARTMENT':
			viewSalesByDepartment();
			break;
		case 'CREATE NEW DEPARTMENT':
			createDepartment();
			break;
		case 'EXIT':
			process.exit();
		default:
			viewSalesByDepartment();
		}
	
	});

};

function viewSalesByDepartment(){

	var sqlQuery = "SELECT departments.*, SUM(orders.price * orders.quantity) AS revenue, SUM(orders.price * orders.quantity) - MAX(departments.overhead) AS profit, COUNT(orders.order_id) AS '# of orders'";
	sqlQuery += " FROM departments, orders WHERE departments.department_name = orders.department_name";
	sqlQuery += " GROUP BY departments.department_name;";
	connection.query(sqlQuery,function(error,results,fields){
		if(error) throw error;
		console.table(results);
		menuOptions();
	})

};

function createDepartment(){
	inquirer.prompt([
	{
		type:'input',
		name:'dept_name',
		message:'\nPlease enter department name.\n'
	},
	{
		type:'input',
		name:'overhead',
		message:'\nPlease enter department overhead ($$).\n',
		filter: function (overhead){
			return parseInt(overhead);
		},
		validate: validateNumber
	}

	]).then(function (input) {
		var name = input.dept_name;
		var overhead = input.overhead;
		var data = [name,overhead];
		var sqlQuery = "INSERT INTO departments (department_name,overhead) VALUES (?,?)"
		connection.query(sqlQuery,data,function(error,results,fields){
			if(error) throw error;
			console.log('\nNew department added\n');
			menuOptions();
		})

	});	
};

function validateNumber (input){
	return !isNaN(parseInt(input)) || 'Must be a number';

};
