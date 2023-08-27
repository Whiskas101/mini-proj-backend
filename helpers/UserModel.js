const [db, SelectAllFrom, rawQuery, Exists, Delete] = require('../helpers/SQLHelper');
const mysql = require('mysql2');


class UserModel {
    //new_table is actually the user table, I just havent gone around to creating an actually decent database schema yet.
    // Each database table along with its schema is stored here temporarily in a JSON object format.

    //static EXPENSE_TABLE = 'expenses';
    static EXPENSE_TABLE = {
        NAME: 'expenses',
        USER_ID: 'user_id',
        EXPENSE_ID: 'expense_id',
        AMOUNT: 'amount',
        DESCRIPTION: 'desc',
        DATE: 'date'
    };

    //static USER_TABLE = 'new_table';
    static USER_TABLE = {
        NAME: 'new_table',
        USER_ID: 'id',
        USERNAME: 'username',
        PASSWORD: 'password'
    };
    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

    static async getUserList(TABLE) {
        console.log(`Calling Database for a list of ALL users in TABLE : ${TABLE}`);
        const [output, _] = await SelectAllFrom(`${TABLE}`);
        return output;
    }

    //PASSWORD MUST BE HASHED. I HAVE NOT DONE IT YET FOR SAKE FOR TESTING AND DEBUGGING.
    // FINAL VERSION MUST HAVE HASHED PASSWORDS
    static async addUser(Username, Password) {
        console.log(`Attempting to add ${Username} to database`);

        //Checking if the user ALREADY exists in the database
        const CHECK_QUERY = `SELECT * FROM ${this.USER_TABLE.NAME} where ${this.USER_TABLE.USERNAME} = ?`;
        const SQL_CHECK_QUERY = mysql.format(CHECK_QUERY, [Username]);

        const [result, _] = await rawQuery(SQL_CHECK_QUERY);
        if (result.length != 0) {
            console.log("User Already Exists!")
            return 500;

        } else {
            //if user doesnt exist, then we can excute the following code
            const QUERY = `INSERT INTO ${this.USER_TABLE.NAME} VALUES (null, ?, ?)`;
            const SQL_QUERY = mysql.format(QUERY, [Username, Password]);
            const [output, _] = await rawQuery(SQL_QUERY);
            return 200;
        }
    }

    //Removes user from a database returns a boolean (not yet implemented)
    static async removeUser(user_id) {
        console.log(`Attempting to remove user id : ${user_id}`);
        return await Delete(this.USER_TABLE.NAME, this.USER_TABLE.USER_ID, user_id);
    }

    // Returns a range of Expenses of past X days
    static async getExpenseRange(range, user_id) {
        console.log(`Attempting to retrieve past ${range} days of expenses`);
        const month_ago = new Date();
        month_ago.setDate(month_ago.getDate() - range);
        const date_month_ago = month_ago.toISOString().slice(0, 19).replace("T", " ");

        const result = await Exists(this.EXPENSE_TABLE.NAME, this.EXPENSE_TABLE.USER_ID, user_id);

        //only proceed if there are expenses for this user
        if (result != false) {
            const RECENT_EXPENSES_QUERY =
                `SELECT * FROM ${this.EXPENSE_TABLE.NAME} where ${this.EXPENSE_TABLE.USER_ID}= ? and ${this.EXPENSE_TABLE.DATE} >= ?`;
            const SQL_RECENT_EXPENSES_QUERY = mysql.format(RECENT_EXPENSES_QUERY, [user_id, date_month_ago])
            const [output, _] = await rawQuery(SQL_RECENT_EXPENSES_QUERY);

            if (output.length == 0) {
                return "No Expenses in the specified time range";
            }
            return output;

        } else {
            return "No expenses for this user, ever.";
        }
    }

    //Returns the sum of expenses made by a user, per day, for X number of past days.
    static async getExpensesByDay(range, user_id){
        console.log(`Attempting to get past ${range} days, grouped by each day`);
        const exists = await Exists(this.EXPENSE_TABLE.NAME, this.EXPENSE_TABLE.USER_ID, user_id);
        
        const month_ago = new Date();
        month_ago.setDate(month_ago.getDate() - range);
        const date_month_ago = month_ago.toISOString().slice(0, 19).replace("T", " ");

        // We are converting DATETIME to DATE here, for sake of simplicity when representing data over a graph
        const RECENT_EXPENSES_QUERY =
                `SELECT SUM(amount), ${this.EXPENSE_TABLE.DATE} FROM DATE(${this.EXPENSE_TABLE.NAME}) dateOnly where ${this.EXPENSE_TABLE.USER_ID}= ? and ${this.EXPENSE_TABLE.DATE} >= ? GROUP BY dateOnly`;
        const SQL_RECENT_EXPENSES_QUERY = mysql.format(RECENT_EXPENSES_QUERY, [user_id, date_month_ago]);



        if(exists){
            
            const result = await rawQuery(SQL_RECENT_EXPENSES_QUERY);
            return result;
        }else{
            return `User ID = ${user_id} doesn't exist`;
        }
    }

    //Returns all expenses made by a particular used id, all of them.
    static async getAllExpenses(UserId) {
        console.log(`Fetching list of all expenses made by user id : ${UserId}`);

        const result = await Exists(this.EXPENSE_TABLE.NAME, this.EXPENSE_TABLE.USER_ID, UserId);

        if (result) {
            return result;
        } else {
            console.log(`No expenses made by user id : ${UserId}`);
            return "no expenses made";
        }
    }

    //Returns a particular user id if it exists, otherwise returns -1;
    static async attemptLogin(Username, Password) {
        //check if the user exists or not (Cannot login without creating an account first 💀)
        console.log(`Task : Attempting login for user : ${Username}`);
        const result = await Exists(this.USER_TABLE.NAME, this.USER_TABLE.USERNAME, Username);

        if (result == false) {
            console.log(`No user with username : ${Username}`);
            return -1;
        } else {
            console.log(result);
            //Accessing result[0] because the result of the query comes as an array, and we need to access the first (and should be only) element
            const STORED_PASSWORD = result[0].password;
            if(STORED_PASSWORD == Password){
                return result[0].id;
            }else{
                return "Incorrect Password";
            }
        }
    }
}

module.exports = UserModel;
