
const express = require('express');
const router = express.Router();


const { registerUser, loginUser, showAllUsers, deleteUser, addExpense } = require('../controllers/user')




router.route('/register')
    .post(registerUser);

router.route("/login")
    .post(loginUser);

router.route("/delete/")
    .post(deleteUser);

router.route("/add/expense")
    .post(addExpense);


module.exports = router;


