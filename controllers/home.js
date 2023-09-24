




const UserModel = require("../helpers/UserModel");

// does nothing in particular, just was added for me to check whether the server is running or not without using a postman request
const homePage = async (req, res) => {
    console.log(req);
    res.status(200).send({ "Status": "200" });
};

// Returns an array of Expenses made by a certain user
const getExpenses = async (req, res) => {
    console.log("PARAMETERS : ", req.params);

    const UserId = req.params.userid;

    const result = await UserModel.getAllExpenses(UserId);
    res.send(result);
};

// Returns an array of Expenses made by a certan user WITHIN a certain time period
const getRecentExpenses = async (req, res) => {
    const range = req.body.range;
    const userid = req.body.userid;

    const result = await UserModel.getExpenseRange(range, userid);
    res.send(result);
}

const getRecentExpensesByDay = async (req, res) => {
    const range = req.body.range;
    const userid = req.body.userid;

    const result = await UserModel.getExpensesByDay(range, userid);

    res.send(result);
}

const getRecentExpensesGrouped = async (req, res) => {
    const range = req.body.range;
    const userid = req.body.userid;

    const result = await UserModel.getExpensesByDayGroupedByCategory(range, userid);

    res.send(result);
}

const getSumOfExpenseRange = async (req, res) => {
    const range = req.body.range;
    const userid = req.body.userid;

    const result = await UserModel.getTotalExpensesInRange(userid, range);

    res.send(result);

}

const getCategorizedExpensesByRange = async (req, res) => {

    const range = req.body.range;
    const userid = req.body.userid;

    const result = await UserModel.getTotalExpensesByCategory(userid, range);

    res.send(result);

}

module.exports = { homePage, getExpenses, getRecentExpenses, getRecentExpensesByDay, getRecentExpensesGrouped, getSumOfExpenseRange, getCategorizedExpensesByRange};