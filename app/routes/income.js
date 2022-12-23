const express = require("express");
const router = express.Router();
const Income = require("../models/Income.class");


// Get Overtime Salary Payroll route
router.post("/dailyIncome", async (req, res) => {
    try {
        const date = req.body.date;
        if (date == '') throw Error("Date field mandatory");

        const income = await Income.getDailyIncome(date);
        res.render("income/dailyIncome", { income, date });
    } catch(error) {
        console.log("Error: " + error);
        res.render("index", {
            errorMessage: error.message
        });
    }
});

router.post("/monthIncome", async (req, res) => {
    try {
        const month = req.body.month;

        const income = await Income.getMonthIncome(month);
        res.render("income/monthIncome", { income, month });
    } catch(error) {
        console.log("Error: " + error);
        res.render("index", {
            errorMessage: error.message
        });
    }
});



module.exports = router;