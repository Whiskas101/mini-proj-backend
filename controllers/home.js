const UserModel = require("../helpers/UserModel");

const homePage = async(req, res)=>{
    console.log(req);
    res.status(200).send({"Status":"200"});
};

//Returns an array of Expenses made by a certain user
const getExpenses = async (req, res)=>{
    console.log("PARAMETERS : ", req.params);

    const UserId = req.params.userid;
    const result = await UserModel.getAllExpenses(UserId);
    res.send(result);
};

//Returns an array of Expenses made by a certan user WITHIN a certain time period
const getRecentExpenses = async(req, res)=>{
    const range = req.body.range;
    const userid = req.body.userid;

    const result = await UserModel.getExpenseRange(range, userid);
    res.send(result);

}

module.exports = {homePage, getExpenses, getRecentExpenses};