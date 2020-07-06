const mysql = require('mysql');
const express = require('express');


const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'employee_db',
});

connection.connect((err) => {
    if (err) throw err;
    console.log('connection made');
});

module.exports = connection;