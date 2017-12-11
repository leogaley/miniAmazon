var inquirer = require("inquirer");
var mysql = require("mysql");

menuOptions();

function menuOptions() {

	
	inquirer.prompt([
	{
		type:'rawlist',
		name:'task',
		message:'\nSupervisor View: Please make a selection.\n',
		choices: ['VIEW PRODUCT SALES BY DEPARTMENT','CREATE NEW DEPARTMENT','EXIT'] //SQL/NPM return item list
	}

	]).then(function (input) {

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
	//sql
	console.log('\nheres sales by department!\n');
	menuOptions();
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
		message:'\nPlease enter department overhead ($$).\n'
	}

	]).then(function (input) {
		//sql
		console.log('\nNew department ' + input.dept_name + ' added.');
		menuOptions();
	});	
}