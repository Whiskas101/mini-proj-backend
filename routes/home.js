const express = require('express');
const router = express.Router();
const { homePage, getExpenses, getRecentExpenses } = require('../controllers/home');



router.route('/')
    .get(homePage);

router.route('/user/:userid')
    .get(getExpenses);

router.route('/expenses/recent')
    .post(getRecentExpenses);
    

module.exports = router;


