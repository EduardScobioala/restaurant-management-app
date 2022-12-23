const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee.class");
const Salary = require("../models/Salary.class");

// All Menu route
router.get("/", async (req, res) => {
    try {
        // const payroll = await Salary.getPayrollStatement();
        // res.render("salary/standart", { payroll });

        const posts = await Employee.getPosts();
        let employees = await Employee.getEmployees({});

        for (let i = 0; i < employees.length; i++) {
            const post = posts.find(obj => obj.postId == employees[i].postId);
            employees[i].postId = post.name;
        }

        res.render("salary/standart", { employees });
    } catch {
        res.redirect("/app");
    }
});

// Get Overtime Salary Payroll route
router.post("/", async (req, res) => {
    try {
        const month = req.body.month;
        const year = _yearValidation(req.body.year);

        const payroll = await Salary.getOvertimePayrollStatement(month, year);
        res.render("salary/overtime", { payroll });
    } catch(error) {
        console.log("Error: " + error);
        res.render("index", {
            errorMessage: error.message
        });
    }
});

function _yearValidation(year) {
    // Year validation
    year = year.trim();
    if (year.length == 0 ) throw Error("Year field mandatory");
    if (year.length != 4) throw Error("Year field must be of 4 digits");
    if (!/^[0-9]+$/.test(year)) throw Error("Year field can be made out of only digits");
    if (parseInt(year) < 2000 || parseInt(year) > 2050) throw Error("Invalid Year");

    return year;
}

module.exports = router;