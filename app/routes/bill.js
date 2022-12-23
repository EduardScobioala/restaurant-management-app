const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const Employee = require("../models/Employee.class");
const Menu = require("../models/Menu.class");
const Bill = require("../models/Bill.class");

// All Employee route
router.get("/", async (req, res) => {
    const searchOptions = {};
    if (req.query.lastName != null && req.query.lastName !== "") {
        searchOptions.lastName = req.query.lastName.trim();
    }
    try {
        const employees = await Employee.getEmployees({});
        let bills = await Bill.getBills(searchOptions);

        for (let i = 0; i < bills.length; i++) {
            const employee = employees.find(obj => obj.personId == bills[i].waiterId);
            bills[i].waiterId = employee.firstName + " " + employee.lastName;
        }

        res.render("bills/index", {
            bills : bills,
            searchOptions : searchOptions
        });
    } catch {
        res.redirect("/");
    }
});

// New Employee route
router.get("/new", async (req, res) => {

    const searchOptions = {}; // dummy searchOptions
    const employees = await Employee.getEmployees(searchOptions);
    const menu = await Menu.getMenu(searchOptions);
    const bill = {
        date: ""
    };

    res.render("bills/new", { bill, employees, menu });
});

// Create Employee route
router.post("/", async (req, res) => {
    const employees = await Employee.getEmployees({});
    const menu = await Menu.getMenu({});
    const rawBill = req.body;

    try {
        bill = _dataValidation(rawBill, employees, menu);
        await Bill.saveBill(bill, menu);

        res.redirect("bills");
    } catch(error) {
        console.log("Error: " + error);
        res.render("bills/new", {
            bill: rawBill,
            employees: employees,
            menu: menu,
            errorMessage: error.message
        });
    }
});

function _dataValidation(rawBill, employees, menu) {

    // Waiter validation
    const fullName = rawBill.employeeId.split(" ");
    const firstName = fullName[0], lastName = fullName[1]; 
    const employee = employees.find(obj => obj.firstName == firstName && obj.lastName == lastName);
    rawBill.employeeId = employee.personId;

    if (rawBill.date == '') throw Error("Date field mandatory");
    rawBill.date = rawBill.date.trim();

    if (!rawBill.dish) throw Error("An order cannot be made with no dish selected");

    // Create BillId
    rawBill.billId = crypto.randomBytes(5).toString('hex').toUpperCase();

    return rawBill;
}

module.exports = router;