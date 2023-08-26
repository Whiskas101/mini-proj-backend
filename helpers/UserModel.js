const [db, SelectAllFrom, rawQuery] = require('../helpers/SQLHelper');
const mysql = require('mysql2');


class UserModel {

    //new_table is actually the user table, I just havent gone around to creating an actually decent database schema yet.
    static EXPENSE_TABLE = 'expenses';
    static USER_TABLE = 'new_table';
    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

    static async getUserList(TABLE) {
        console.log(`Calling Database for a list of ALL users in TABLE : ${TABLE}`);
        const [output, _] = await SelectAllFrom(`${this.USER_TABLE}`);
        return output;
    }

    //PASSWORD MUST BE HASHED. I HAVE NOT DONE IT YET FOR SAKE FOR TESTING AND DEBUGGING.
    // FINAL VERSION MUST HAVE HASHED PASSWORDS
    static async addUser(Username, Password) {
        console.log('Task: Adding a user to database');

        //Checking if the user ALREADY exists in the database
        const CHECK_QUERY = `SELECT * FROM ${this.USER_TABLE} where username = ?`;
        const SQL_CHECK_QUERY = mysql.format(CHECK_QUERY, [Username]);

        const [result, _] = await rawQuery(SQL_CHECK_QUERY);
        if (result.length != 0) {
            console.log("User Already Exists!")
            return 500;

        } else {
            //if user doesnt exist, then we can excute the following code
            const QUERY = `INSERT INTO ${this.USER_TABLE} VALUES (null, ?, ?)`;
            const SQL_QUERY = mysql.format(QUERY, [Username, Password]);
            const [output, _] = await rawQuery(SQL_QUERY);
            return 200;
        }
    }

    static async removeUser(Id) {

    }
S
    static async getExpenseRange(range, user_id) {
        console.log(`Attempting to retrieve past ${range} days of expenses`);
        //Get expense between a given day and time!
        const current_date = new Date();
        const formatted_current_date = current_date.toISOString().slice(0, 19).replace("T", " ");

        const month_ago = new Date();
        month_ago.setDate(month_ago.getDate() - range);
        const date_month_ago = month_ago.toISOString().slice(0, 19).replace("T", " ");

        // console.log(formatted_current_date);
        // console.log(formatted_month_ago);

        //Checking if any expenses have been made
        const CHECK_QUERY = `SELECT * FROM ${this.EXPENSE_TABLE} where user_id = ?`;
        const SQL_CHECK_QUERY = mysql.format(CHECK_QUERY, [user_id]);

        const result = await rawQuery(SQL_CHECK_QUERY);

        //only proceed if there are expenses for this user
        if (result != 0) {
            const RECENT_EXPENSES_QUERY = `SELECT * FROM ${this.EXPENSE_TABLE} where user_id= ? and date >= ?`;
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

    static async getAllExpenses(UserId) {
        console.log(`Fetching list of all expenses made by : ${UserId}`);

        //First we check whether the user has made any expenses, if no such expenses exist we send -1 back
        const CHECK_QUERY = `SELECT * FROM ${this.EXPENSE_TABLE} WHERE user_id=?`;
        const SQL_CHECK_QUERY = mysql.format(CHECK_QUERY, [UserId]);

        const [result, _] = await rawQuery(SQL_CHECK_QUERY);

        if (result.length != 0) {
            return result;
        } else {
            console.log(`No expenses made by user id : ${UserId}`);
            return "no expenses made";
        }

    }

    static async attemptLogin(Username, Password) {
        //check if the user exists or not (Cannot login without creating an account first 💀)
        console.log(`Task : Attempting login for user : ${Username}`);
        const CHECK_QUERY = `SELECT * FROM ${this.USER_TABLE} WHERE username=?`;
        const SQL_CHECK_QUERY = mysql.format(CHECK_QUERY, [Username, Password]);

        const [result, _] = await rawQuery(SQL_CHECK_QUERY);
        if (result.length == 0) {
            console.log(`No user with username : ${Username}`);
            return -1;
        } else {
            console.log(result);
            //Accessing result[0] because the result of the query comes as an array, and we need to access the first (and should be only) element
            return result[0].id;
        }
    }
}

module.exports = UserModel;
