const express = require('express');
const router = express.Router();
const { homePage, getExpenses, getRecentExpenses, getRecentExpensesByDay, getRecentExpensesGrouped, getSumOfExpenseRange, getCategorizedExpensesByRange } = require('../controllers/home');



router.route('/')
    .get(homePage);

router.route('/user/:userid')
    .get(getExpenses);

router.route('/expenses/recent')
    .post(getRecentExpenses);

router.route('/expenses/by/days')
    .post(getRecentExpensesByDay);

router.route('/expenses/by/day/by/category')
    .post(getRecentExpensesGrouped);

router.route('/expenses/sum/by/range')
    .post(getSumOfExpenseRange);

router.route('/expenses/sum/by/category')
    .post(getCategorizedExpensesByRange);

module.exports = router;


