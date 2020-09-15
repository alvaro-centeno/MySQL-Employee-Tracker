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

function addEmp() {
    managerQuery()
        .then(res => {
            inquirer
                .prompt([
                    {
                        type: "input",
                        message: "First name:",
                        name: "first"
                    },
                    {
                        type: "input",
                        message: "Last name:",
                        name: "last"
                    },
                    {
                        type: "list",
                        message: "Role:",
                        name: "role_id",
                        choices: [

                            "1 - Sales Lead",
                            "2 - Salesperson",
                            "3 - Lead Engineer",
                            "4 - Software Engineering",
                            "5 - Finance",
                            "6 - Legal Team Lead",
                            "7 - Lawyer"


                        ]
                    }
                ])
                .then(data => {
                    let title = parseInt(data.role_id.charAt(0));
                    let first_name = data.first;
                    let last_name = data.last;
                    let noMgr = null;
                    if (
                        title === 2 ||
                        title === 4 ||
                        title === 5 ||
                        title === 6
                    ) {
                        inquirer
                            .prompt([
                                {
                                    type: "list",
                                    message: "Manager:",
                                    name: "manager",
                                    choices: mgrArr
                                }
                            ])
                            .then(data => {
                                noMgr = parseInt(data.manager.charAt(0));
                                const queryString = `INSERT INTO employee_db.employee_table (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`;
                                connection.query(
                                    queryString,
                                    [first_name, last_name, title, noMgr],
                                    function (err) {
                                        if (err) throw err;
                                        console.log("Welcome to the team");
                                        employeeManager();
                                    }
                                );
                            });
                    } else {
                        console.log(title);
                        console.log(data);
                        connection.query(
                            `INSERT INTO employee_db.employee_table (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`,
                            [first_name, last_name, title, noMgr],
                            function (err) {
                                if (err) throw err;
                                console.log("Welcome to the team");
                                employeeManager();
                            }
                        );
                    }
                });
        })
        .catch(console.error);
}

function addRole() {
    departmentQuery()
        .then(res => {
            inquirer
                .prompt([
                    {
                        type: "input",
                        message:
                            "What role would you like to add?",
                        name: "roleName"
                    },
                    {
                        type: "input",
                        message: "What will the salary be for this new role?",
                        name: "salary"
                    },
                    {
                        type: "list",
                        message:
                            "Which department will this new role be in under?",
                        name: "dept",
                        choices: deptArr
                    }
                ])
                .then(data => {
                    let deptNum = parseInt(data.dept.charAt(0));
                    const queryString =
                        "INSERT INTO employee_db.role_table (title, salary, department_id) values (?, ?, ?);";
                    connection.query(
                        queryString,
                        [data.roleName, data.salary, deptNum],
                        function (err) {
                            if (err) throw err;
                            console.log("Role Added!");
                            employeeManager();
                        }
                    );
                });
        })
        .catch(console.error);
};

function addDept() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "New department name:",
                name: "deptName"
            }
        ])
        .then(data => {
            const queryString = `INSERT INTO employee_db.department_table (dept_name) values (?);`;
            connection.query(queryString, [data.deptName], (err) => {
                if (err) throw err;
                console.log("Department added!");
                employeeManager();
            });
        });
};



const deleteEmp = (id) => {
    return new Promise(() => {
        connection
            .query(`DELETE FROM employee_db.employee_table WHERE id = ?`, [id], (err) => {
                if (err) throw err;
            })
    })
}

const deleteEmployee = async () => {

    let empList = await empSelect()

    try {
        inquirer.prompt([
            {
                name: "empDelete",
                message: "Delete which employee?",
                type: "list",
                choices: empList.map(e => { return { name: e.first_name + " " + e.last_name, value: e.id } })

            },
            {
                name: "confirm",
                message: "Delete?",
                type: "confirm",
            },
        ]).then((res) => {

            console.log('Employee Deleted');

            if (res.confirm === true) {
                deleteEmp(res.empDelete)
            }
            employeeManager()
        })
    } catch (err) {
        console.log(err);

    }
}

function updateRole() {
    employeeQuery()
        .then(result => {
            inquirer
                .prompt([
                    {
                        type: "list",
                        message:
                            "Choose the employee's role that you would you like to update",
                        name: "employee",
                        choices: empArr
                    },
                    {
                        type: "list",
                        message: "choose the role of the employee:",
                        name: "newRole",
                        choices: [
                            "1 - Sales Lead",
                            "2 - Salesperson",
                            "3 - Lead Engineer",
                            "4 - Software Engineer",
                            "5 - Accountant",
                            "6 - Legal Team Lead",
                            "7 - Lawyer"
                        ]
                    }
                ])
                .then(data => {
                    const title = parseInt(data.newRole.charAt(0));
                    const queryString = `UPDATE employee_db.employee_table SET role_id=? WHERE first_name=?;`;
                    connection.query(
                        queryString,
                        [title, data.employee],
                        function (err, data) {
                            if (err) throw err;
                            console.table("Role Updated!");
                            employeeManager();
                        }
                    );
                });
        })
        .catch(console.error);
}

function employeeQuery() {
    return new Promise((resolve, reject) => {
        const queryString = `SELECT * FROM employee_db.employee_table;`;
        connection.query(queryString, (err, data) => {
            if (err) reject(err);
            array = data.map(emp => emp.first_name);
            empArr = array;
            resolve(empArr);
        });
    });
}

function managerQuery() {
    return new Promise((resolve, reject) => {
        const queryString = `SELECT * FROM employee_db.employee_table;`;
        connection.query(queryString, (err, data) => {
            if (err) reject(err);
            let array = data
                .filter(mgr => {
                    return mgr.manager_id === null;
                })
                .map(x => x.id + " " + x.first_name);
            mgrArr = array;
            resolve(mgrArr);
        });
    });
}

function departmentQuery() {
    return new Promise((resolve, reject) => {
        const queryString = `SELECT * FROM employee_db.department_table;`;
        connection.query(queryString, (err, data) => {
            if (err) reject(err);
            let array = data.map(dept => dept.id + " " + dept.dept_name);
            deptArr = array;
            resolve(deptArr);
        });
    });
}