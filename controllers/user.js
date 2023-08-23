

const mysql = require('mysql2');
const UserModel = require('../helpers/UserModel.js');


const registerUser = async (req, res)=>{

    // const data = await UserModel.getUserList("new_table");
    // res.send(data);
    const data2 = await UserModel.getExpense("1");
    res.send(data2);
    

}

module.exports = {registerUser};





