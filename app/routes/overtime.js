const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee.class");
const Overtime = require("../models/Overtime.class");

// All Menu route
router.get("/", async (req, res) => {
    const searchOptions = {};
    if (req.query.month != null && req.query.month !== "") {
        searchOptions.month = req.query.month.trim();
    }
    try {
        const employees = await Employee.getEmployees({});
        let overtime = await Overtime.getOvertime(searchOptions);

        for (let i = 0; i < overtime.length; i++) {
            const employee = employees.find(obj => obj.personId == overtime[i].employeeId);
            overtime[i].employeeId = employee.firstName + " " + employee.lastName;
        }

        res.render("overtime/index", {
            overtime : overtime,
            searchOptions : searchOptions
        });
    } catch {
        res.redirect("/");
    }
});

// New Menu route
router.get("/new", async (req, res) => {
    const overtime = {
        employeeId: "",
        month: "",
        year: "",
        hours: "",
        price: ""
    }
    const searchOptions = {}; // dummy searchOptions
    const employees = await Employee.getEmployees(searchOptions);

    res.render("overtime/new", { overtime, employees });
});

// Create Menu route
router.post("/", async (req, res) => {
    const employees = await Employee.getEmployees({});
    const rawOvertime = {
        employeeId: req.body.employeeId,
        month: req.body.month,
        year: req.body.year,
        hours: req.body.hours,
        price: req.body.price
    }

    try {
        const overtime = _dataValidation(rawOvertime, employees);
        await Overtime.saveOvertime(overtime);

        res.redirect("overtime");
    } catch(error) {
        console.log("Error: " + error);
        res.render("overtime/new", {
            employees: employees,
            overtime: rawOvertime,
            errorMessage: error.message
        });
    }
});

function _dataValidation(overtime, employees) {

    // Employee validation
    const fullName = overtime.employeeId.split(" ");
    const firstName = fullName[0], lastName = fullName[1]; 
    const employee = employees.find(obj => obj.firstName == firstName && obj.lastName == lastName);
    overtime.employeeId = employee.personId;

    // Month validation
    overtime.month = overtime.month.trim();

    // Year validation
    overtime.year = overtime.year.trim();
    if (overtime.year.length == 0 ) throw Error("Year field mandatory");
    if (overtime.year.length != 4) throw Error("Year field must be of 4 digits");
    if (!/^[0-9]+$/.test(overtime.year)) throw Error("Year field can be made out of only digits");
    if (parseInt(overtime.year) < 2000 || parseInt(overtime.year) > 2050) throw Error("Invalid Year");

    // Hours
    overtime.hours = overtime.hours.trim();
    if (overtime.hours.length == 0 ) throw Error("Hours field mandatory");
    if (!/^\d+$/.test(overtime.hours)) throw Error("Hours field can be made out of only digits");
    if (overtime.hours.length > 2 ) throw Error("Hours must not exceed 2 digits");

    // Price
    overtime.price = overtime.price.trim();
    if (overtime.price.length == 0 ) throw Error("Price field mandatory");
    if (!/^[+-]?\d+(\.\d+)?$/.test(overtime.price)) throw Error("Price field can be made out of only digits, format 'n' or 'n.zz'");

    return overtime;
}


module.exports = router;