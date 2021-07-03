const pg = require('pg');
const Pool = pg.Pool;
const config = {
    database: 'weekend-to-do-app', // the name of the database
    host: 'localhost', // where is your database
    port: 5432, // the port number for your database, 5432 is the default
    max: 10, // how many connections at one time
    idleTimeoutMillis: 30000, // 30 seconds to try to connect
  };

const pool = new Pool(config);

// for debugging. Not required
pool.on('connect', (client) => {
    console.log('PostgeSQL connected');
});

pool.on('error', (err, client) => {
    console.log('Unexpected error on idle client', err);
  });

module.exports = pool;