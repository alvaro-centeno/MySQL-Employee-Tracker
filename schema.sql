DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department(
id INT NOT NULL auto_increment,
name VARCHAR(30),
PRIMARY KEY(id)
);

CREATE TABLE role(
id INT NOT NULL auto_increment,
title VARCHAR(30),
salary DECIMAL (10,4) NULL,
department_id INT,
PRIMARY KEY(id),
FOREIGN KEY (department_id) REFERENCEs department(id)
);

CREATE TABLE employee(
id INT NOT NULL auto_increment,
first_name VARCHAR(30),
last_name VARCHAR(30),
role_id INT NOT NULL,
manager_id INT,
PRIMARY KEY(id),
FOREIGN KEY (role_id) REFERENCES role(id),
FOREIGN KEY (manager_id) REFERENCES employee(id)
);

SELECT * FROM employee;
