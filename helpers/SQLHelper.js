
const mysql = require('mysql2');

// I HAVE YET TO SET UP ENV VARIABLES. THIS IS JUST ALPHA CODE. NOT SECURE. DO NOT USE REAL/IMPORTANT WORDS.

const DB_NAME = "user_data";
const HOST = "localhost";
const USER = "root";
const PASSWORD = "root";
const CONNECTION_LIMIT = 15;

// set up max connections to be 15, just a random number. 
const pool = mysql.createPool({
    connectionLimit: CONNECTION_LIMIT,
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DB_NAME,
});

//For modern standards and avoiding callback hell
const Pool = pool.promise();



async function SelectAllFrom(table) {
    let connection;
    try {
        connection = await Pool.getConnection();
        const QUERY = `SELECT * FROM ${table}`;
        const [dataArray, _] = await connection.query(QUERY);

        return dataArray;

    } catch (error) {
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}


async function Select(Table, Id) {

    let connection;
    try {
        connection = await Pool.getConnection();
        const QUERY = `SELECT * FROM ${Table} where id=?`;
        const SQL_QUERY = mysql.format(QUERY, [Id]);

        const output = connection.query(SQL_QUERY);
        return output;


    } catch (error) {
        throw error;
    } finally {
        if(connection){
            connection.release();
        }
    }

}



//functions that are meant to be used out of this file
module.exports = [pool.promise(), SelectAllFrom, Select];

