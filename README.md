# miniAmazon

This project is a CLI demonstrating how to interact with a mySQL database using Inquirer from command line. This is displaying screens of the app in action and the source code, not intended to actually be run from what is provided here. 


### Prerequisites

The following NPM packages are dependencies:

```
console.table
inquirer
mysql
```

Also required for this app is a connection to database with tables for: 
```
products
orders
departments
```

Here is the SQL used to initialize the tables and databse:

```
DROP DATABASE bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(30),
    department_name VARCHAR(30),
    price FLOAT(6,2),
    stock_quantity INT(6)

);

CREATE TABLE departments (
	dept_id INT PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(30),
    overhead FLOAT(6,2)

);

CREATE TABLE orders (
	order_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(30),
    department_name VARCHAR(30),
    price FLOAT(6,2),
    quantity INT(6),
    customer_name VARCHAR(50)
);

```

### Screenshots

Here is what the app looks like from console.

bamazonCustomer.js

1) Runs through options for making a purchase, pulled from [products] table. 
![Customer View](/Screens/1.JPG?raw=true "Customer View")

2) Completed Purchase.  [orders] and [products] tables updated.  
![Completed Order](/Screens/2.JPG?raw=true "Completed Order")

bamazonManager.js

1) Here are all the manager view options.  
![Manager View](/Screens/3.JPG?raw=true "Manager View")

2) VIEW PRODUCTS FOR SALE - Show entire [products], from database using mysql and console.table.  
![View Products for Sale](/Screens/4.JPG?raw=true "View Products for Sale")

3) VIEW LOW INVENTORY - Show items w/inventory less than 5. Below the table is just the original options again, to choose something else.  
![Low Inventory](/Screens/5.JPG?raw=true "Low Inventory")

4) ADD TO INVENTORY - Showing before and after of adding products (quantity) to inventory.  Note the quantity of basketballs in this example.  
![Add to Inventory](/Screens/6.JPG?raw=true "Add to Inventory")

5) ADD NEW PRODUCT - Showing before and after of adding a new item.
![Add New Product](/Screens/7.JPG?raw=true "Add New Product")
![Add New Product](/Screens/7b.JPG?raw=true "Add New Product")

bamazonSupervisor.js

1) VIEW PRODUCT SALES BY DEPARTMENT / ADD NEW DEPARTMENT - combines [orders] and [departments] tables to create a table showing profit per department (one row per department).
2) ADD NEW DEPARTMENT - create new department.  This is show after the product sales table. 
![Completed Order](/Screens/9.JPG?raw=true "Completed Order")


### Other notes / Limitations

If I were to continue adding to this - I would refactor to more appropriately use the IDs (product, department, order) more appropriately as a primary key in relational database.  The way this exists now, it is relying pretty heavily on name strings.  Which are not required to be unique.  So in production that would be an issue.  


