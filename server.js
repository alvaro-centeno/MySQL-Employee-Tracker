const mysql = require("mysql");
const inquirer = require("inquirer");
let empArr;
let mgrArr;
let deptArr;

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password"
});

async function connecting() {
    connection.connect(function (err) {
        if (err) throw err;
    });
}

async function app() {
    await connecting();
    employeeManager();
}

app();

function employeeManager() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                name: "begin",
                choices: [
                    "View All Employees",
                    "View All Employees By Department",
                    "View All Employees By Manager",
                    "View All Roles",
                    "View All Departments",
                    "Add Employee",
                    "Add Role",
                    "Add Department",
                    "Remove Employee",
                    "Update Employee Role",
                    "Exit",
                ]
            }
        ])
        .then(data => {
            const userChoice = data.begin;
            if (userChoice === "View All Employees") {
                renderEmployees();
            } else if (userChoice === "View All Employees By Department") {
                renderEmpByDept();
            } else if (userChoice === "View All Employees By Manager") {
                renderEmpByMgr();
            } else if (userChoice === "View All Roles") {
                renderRoles();
            } else if (userChoice === "View All Departments") {
                renderDept();
            } else if (userChoice === "Add Employee") {
                addEmp();
            } else if (userChoice === "Add Role") {
                addRole();
            } else if (userChoice === "Add Department") {
                addDept();
            } else if (userChoice === "Remove Employee") {
                deleteEmployee();
            } else if (userChoice === "Update Employee Role") {
                updateRole();
            } else {
                console.log("Mischief Managed");
                connection.end();
            }
        });
}

function empSelect() {
    return new Promise((resolve, reject) => {
        connection
            .query(`SELECT id, first_name, last_name FROM employee_db.employee_table ORDER BY id;`, (err, data) => {
                if (err) throw err;
                resolve(data);
            })
    })
}

function renderEmployees() {
    connection
        .query(`SELECT employee_table.id, employee_table.first_name, employee_table.last_name, role_table.title, department_table.dept_name AS department, role_table.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee_db.employee_table LEFT JOIN employee_db.role_table ON employee_table.role_id = role_table.id LEFT JOIN employee_db.department_table on role_table.department_id = department_table.id LEFT JOIN employee_db.employee_table manager ON manager.id = employee_table.manager_id ORDER BY employee_table.id;`,
            (err, data) => {
                if (err) throw err;
                console.table(data);
                employeeManager();

            });
}

function renderEmpByDept() {
    connection.query(`SELECT employee_table.id, employee_table.first_name, employee_table.last_name, role_table.title, department_table.dept_name AS department FROM employee_db.employee_table LEFT JOIN employee_db.role_table ON employee_table.role_id = role_table.id LEFT JOIN employee_db.department_table ON department_table.id = role_table.department_id ORDER BY role_table.title`,
        (err, data) => {
            if (err) throw err;
            console.table(data);
            employeeManager();
        });
}

function renderEmpByMgr() {
    connection.query(`SELECT employee_table.id, employee_table.first_name, employee_table.last_name, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee_db.employee_table LEFT JOIN employee_db.employee_table manager ON manager.id = employee_table.manager_id ORDER BY manager;`, (err, data) => {
        if (err) throw err;
        console.table(data);
        employeeManager();
    });
}

function renderRoles() {
    connection.query(`SELECT * FROM employee_db.role_table;`, (err, data) => {
        if (err) throw err;
        console.table(data);
        employeeManager();
    });
}

function renderDept() {
    connection.query(`SELECT * FROM employee_db.department_table;`,
        (err, data) => {
            if (err) throw err;
            console.table(data);
            employeeManager();
        });
}

