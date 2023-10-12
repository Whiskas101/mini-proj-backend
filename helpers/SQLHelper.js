
const mysql = require('mysql2');


// I HAVE YET TO SET UP ENV VARIABLES. THIS IS JUST ALPHA CODE. NOT SECURE. DO NOT USE REAL/IMPORTANT WORDS.

const DB_NAME = "user_data";
const HOST = "localhost";
const USER = "root";
const PASSWORD = "root";
const CONNECTION_LIMIT = 1;

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


//As the name implies, it returns all tuples from a given table name, provided that table actually exists within the database
async function SelectAllFrom(table) {
    
    const QUERY = `SELECT * FROM ${table}`;
    return await rawQuery(QUERY);

}

// HELPER FUNCTION to be used within other functions, serves no purpose on its own
// Checks for existence of a particular tuple within a table
// RETURNS false if it doesn't exist, returns all the relevant rows if it does exist.
const Exists = async(table, attribute, value)=>{
    console.log(`Checking if ${attribute}=${value} exists in ${table}`);
    const CHECK_QUERY = `SELECT * FROM ${table} WHERE ${attribute}=?`;
    const SQL_CHECK_QUERY = mysql.format(CHECK_QUERY, [value]);
    const [result, _] = await rawQuery(SQL_CHECK_QUERY);

    if (result.length == 0){
        console.log(`${attribute}=${value} does not exist in ${table}`);
        return false;
    }else{
        console.log(`${attribute}=${value} exists in ${table}`);
        return result;
    }
}

//Checks for the existence of a particular tuple within a database, if its FOUND, it is then DELETED.
const Delete = async(table, attribute, value)=>{
    
    const exists = await Exists(table, attribute, value);
    if(exists){
        console.log(`Attempting to delete ${attribute}=${value} from table ${table}`);
        const DELETE_QUERY = `DELETE FROM ${table} WHERE ${attribute}=?`;
        const SQL_DELETE_QUERY = mysql.format(DELETE_QUERY, [value]);

        const [result, _] = await rawQuery(SQL_DELETE_QUERY);
        return result;
    }
    return `${attribute}=${value} does not exist in ${table}`;
}

//Takes in a SQL query, and returns an array of rows
const rawQuery = async (query) => {
    let connection;
    try {
        connection = await Pool.getConnection();
        console.log("Gained Connection to Database")
        return await connection.query(query);
    }catch(err){
        console.log("Could not connect to Database")
        throw err;

    }finally{
        if(connection){
            connection.release();
            console.log('Released Connection')
        }
    }
}

//functions that are meant to be used out of this file
module.exports = [pool.promise(), SelectAllFrom, rawQuery, Exists, Delete];

 