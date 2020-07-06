const mysql = require('mysql');
const inquierer = require('inquirer');
const express = require('express');
const PORT = process.env.PORT || 3000;



const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employee_db",
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connection.connect(async (err) => {
    if (err) throw err;

    app.get('/', (req, res) => {
        console.log('api hit');

        connection.query('SELECT * FROM todos', (err, data) => {
            err ? console.log(err) : res.json(data);


            // if (err) {
            //     console.log(err);
            // }
            // console.log(data);
            // res.json(data);
        })
    });
    app.listen(PORT, () => {
        console.log(`listening at: http://localhost:${PORT}`);
    })
})

function searchMenu() {
    inquirer
        .prompt({
            name: "search",
            message: "enter the id you are searching for",
            type: "input",
        })
        .then((res) => {
            findTodo(res.search).then((res) => {
                console.log(res);
                mainMenu();
            });
        });
}
function mainMenu() {
    inquirer
        .prompt([
            {
                name: "mainMenu",
                message: "Where would you like to go?",
                type: "list",
                choices: ["View all", "View one", "Delete one", "Edit", "Exit"],
            },
        ])
        .then((res) => {
            switch (res.mainMenu) {
                case "View all":
                    readAllTodos().then((res) => {
                        console.log(res);
                        mainMenu();
                    });
                    break;
                case "View one":
                    searchMenu();
                    break;
                case "Exit":
                    connection.end();
                    process.exit();
                default:
                    break;
            }
        });
}

connection.connect(async (err) => {
    if (err) throw err;
    console.log("We have been connected");
    mainMenu();
});
const findTodo = (findId) => {
    return new Promise((resolve, reject) => {
        connection.query(
            "SELECT * FROM todos WHERE ?",
            [{ id: findId }],
            (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            }
        );
    });
};
const readAllTodos = () => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM todos", (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};
const addTodo = (newText) => {
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO todos SET ?", [{ text: newText }], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve({ msg: "Successfully added!!!" });
            }
        });
    });
};