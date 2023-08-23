const [db, SelectAllFrom, Select] = require('../helpers/SQLHelper');


class UserModel{

    //new_table is actually the user table, I just havent gone around to creating an actually decent database schema yet.
    static EXPENSE_TABLE = 'new_table';

    static async getUserList(TABLE){
        console.log(`Calling Database for a list of ALL users in TABLE : ${TABLE}`);
        return await SelectAllFrom("new_table");
    }

    static async addUser(UserData){

    }

    static async removeUser(Id){

    }

    static async getExpense(Id){
        return await Select(this.EXPENSE_TABLE, Id);
    }

    static async getAllExpenses(UserId){

    }

}

module.exports = UserModel;
