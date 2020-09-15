INSERT INTO department_table
    (dept_name)
VALUES
    ("Sales"),
    ("Engineering"),
    ("Finance"),
    ("Legal");


INSERT INTO role_table
    (title, salary, department_id)
VALUES
    ("Sales Lead", 100000, 1),
    ("Salesperson", 85000, 1),
    ("Lead Engineer", 160000, 2),
    ("Software Engineer", 120000, 2),
    ("Accountant", 90000, 3),
    ("Legal Team Lead", 75000, 4),
    ("Lawyer", 200000, 4);

INSERT INTO employee_table
    (first_name, last_name, role_id, manager_id)
VALUES
    ("Harry", "Potter", 1, null),
    ("Hermoine", "Granger", 2, 1),
    ("Ronald", "Weasley", 3, null),
    ("Draco", "Malfoy", 4, 3),
    ("Luna", "Lovegood", 4, 3),
    ("Albus", "Dumbledore", 5, 1),
    ("Severus", "Snape", 7, null),
    ("Minerva", "McGonagall", 6, 7);
