
const express = require('express');
const router = express.Router();


const { registerUser, loginUser, showAllUsers, deleteUser, addExpense, deleteExpense } = require('../controllers/user')




router.route('/register')
    .post(registerUser);

router.route("/login")
    .post(loginUser);

router.route("/delete/")
    .post(deleteUser);

router.route("/add/expense")
    .post(addExpense);

router.route("/remove/expense")
    .post(deleteExpense);


module.exports = router;


