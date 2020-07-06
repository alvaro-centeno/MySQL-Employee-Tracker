INSERT INTO department
    (name)
VALUES('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');

INSERT INTO role
    (title, department_id, salary)
VALUES
    ('Sales Lead', 1, 100000),
    ('Lead Engineer', 2, 150000),
    ('Software Engineer', 3, 100000),
    ('Accountant', 4, 90000),
    ('Legal Team Lead', 5, 100000),
    ('Lawyer', 6, 200000);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Jared', 'Joseph', 1, null ),
    ('Alvaro', 'Centeno', 2, null),
    ('Nasser', 'Hassan', 3, 2),
    ('Heather', 'Sisson', 4, 1),
    ('Toya', 'Monet', 5, 6),
    ('Leona', 'Peiris', 6, null);