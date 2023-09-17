
const UserModel = require('../helpers/UserModel.js');

// THESE FUNCTIONS CURRENTLY SEND THE RESULT AS A RESPONSE.
// MODIFY ACCORDING TO YOUR NEEDS
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

    const user = await UserModel.attemptLogin(Username, Password);

    if (user == -1) {
        res.send({user: "-1"});
        
    } else {
        res.send({user: user});
        
    }

}

const showAllUsers = async (req, res) => {
    const data = await UserModel.getUserList("new_table");
    res.send(data);
}

const deleteUser = async(req, res) =>{
    const userid = req.body.userid;
    
    const result = await UserModel.removeUser(userid);
    res.send(result);
}

const addExpense = async(req, res) =>{
    const userid = req.body.userid;
    const desc = req.body.desc;
    const amount = req.body.amount;
    const category = req.body.category;

    const result = await UserModel.addExpense(amount, category, desc, userid);
    res.send(result);
}

const deleteExpense = async(req, res) => {
    const expense_id = req.body.expenseid;

    const result = await UserModel.removeExpense(expense_id);
    res.send(result);
}


module.exports = { registerUser, loginUser, showAllUsers, deleteUser, addExpense, deleteExpense };





