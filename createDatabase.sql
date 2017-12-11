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


SELECT * FROM products;