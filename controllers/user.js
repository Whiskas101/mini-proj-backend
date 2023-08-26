
const mysql = require('mysql2');
const UserModel = require('../helpers/UserModel.js');


const registerUser = async (req, res) => {

    // const data = await UserModel.getUserList("new_table");
    // res.send(data);
    console.log("Super")
    const Username = req.body.username;
    const Password = req.body.password;

    const result = await UserModel.addUser(Username, Password);

    //Says internal server error if user already exists, says OK if user is new, can change whenever if need arises
    res.sendStatus(result);

}

const loginUser = async (req, res) => {
    const Username = req.body.username;
    const Password = req.body.password;

    const user_id = await UserModel.attemptLogin(Username, Password);

    if (user_id == -1) {
        res.sendStatus(500);
        return null;
    } else {
        res.sendStatus(200);
        return user_id;
    }

}



const showAllUsers = async (req, res) => {
    const data = await UserModel.getUserList("new_table");
    res.send(data);
}



module.exports = { registerUser, loginUser, showAllUsers };





