CREATE TABLE tasks (
"id" serial PRIMARY KEY,
"task" varchar(240),
"priority" varchar(10),
"status" varchar(10)
);

SELECT * FROM tasks;
