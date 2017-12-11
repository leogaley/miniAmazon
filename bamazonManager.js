var inquirer = require("inquirer");
var mysql = require("mysql");

menuOptions();

function menuOptions() {

	
	inquirer.prompt([
	{
		type:'rawlist',
		name:'task',
		message:'\nManager View: Please make a selection.\n',
		choices: ['VIEW PRODUCTS FOR SALE','VIEW LOW INVENTORY','ADD TO INVENTORY','ADD NEW PRODUCT','EXIT'] //SQL/NPM return item list
	}

	]).then(function (input) {

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
	//sql
	console.log('\nheres all the inventory!\n');
	menuOptions();
};

function viewLowInventory(){
	//sql 
	console.log('\nheres the low stock inventory!\n');
	menuOptions();
};

function addInventory() {
	inquirer.prompt([
	{
		type:'rawlist',
		name:'itemID',
		message:'Please select an item',
		choices: getItemArray()
	},
	{
		type:'input',
		name:'quantity',
		message:'Please enter the quantity to add.'
	}

	]).then(function (input) {
		var name = input.itemID;
		var quantity = input.quantity;

		//sql add 
		console.log('\nQuantity ' + quantity +  ' of ' + name + ' added to database.\n');
		menuOptions();
	
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
		message:'Please enter an initial quantity'
	}

	]).then(function (input) {
		var name = input.itemName;
		var quantity = input.initialQuantity;

		//sql add 
		console.log('\nItem ' + input.itemName + ' added to database.\n');
		menuOptions();
	
	});

};

function getItemArray(){
	//sql
	return ['item1','item2','item3'];

}