const pool = require('../modules/pool');
const express = require('express');
const { Pool } = require('pg');
const todoRouter = express.Router();

//GET
//get list from DB
todoRouter.get('/', (req, res) => {
    //create variable to hold SQL query
    let queryText = 'SELECT * FROM "tasks";';
    //make SQL query to DB...
    pool.query(queryText)
    .then(result => {
        res.send(result.rows);
    })
    .catch(error => {
        console.log('Error trying to get the koala from Postgres', error);
        res.sendStatus(500);
    });
});

//POST
//add task to database
todoRouter.post('/', (req, res) => {
    const newTask = req.body;
    const queryText = `
    INSERT INTO tasks ("task")
    VALUES ($1);
    `;
    pool.query(queryText, [newTask.task])
        .then((result) => {
            res.sendStatus(201);
        })
        .catch((err) => {
            console.log(`Error making query ${queryText}`, err);
            res.sendStatus(500);
        });
});





//DELETE
todoRouter.delete('/:id', (req, res) => {
    console.log('Request URL: ', req.url);
    console.log('Request route parameters: ', req.params);
    const taskId = req.params.id;
    console.log(`Task ID is: ${taskId}`);

    // creates string to delete task
    const queryText = `
    DELETE FROM tasks WHERE id = $1
    `;

    pool.query(queryText, [taskId])
        .then(dbResponse => {
            console.log('How many rows deleted:', dbResponse.rowsCount);
            res.sendStatus(200);
        })
        .catch(error => {
            console.log(`ERROR!! could not delete task with id ${taskId}. Error: ${error}`);
            res.sendStatus(500);
        });
});


//PUT route to update status
todoRouter.put('/:id', (req, res) => {
    const taskId = req.params.id;
    let queryText = `UPDATE "tasks" SET "status"='Done' WHERE id=$1;`;

    pool.query(queryText, [taskId])
    .then(dbResponse => {
        console.log('Updated Task Status:', dbResponse.rowCount);
        res.sendStatus(202);
    })
    .catch(error => {
        console.log('There was an error updating status', error);
        res.sendStatus(500);
    });
})



module.exports = todoRouter;