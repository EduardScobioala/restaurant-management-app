const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee.class");

// All Employee route
router.get("/", async (req, res) => {
    const searchOptions = {};
    if (req.query.lastName != null && req.query.lastName !== "") {
        searchOptions.lastName = req.query.lastName.trim();
    }
    try {
        const posts = await Employee.getPosts();
        let employees = await Employee.getEmployees(searchOptions);

        for (let i = 0; i < employees.length; i++) {
            const post = posts.find(obj => obj.postId == employees[i].postId);
            employees[i].postId = post.name;
        }

        res.render("employees/index", {
            employees : employees,
            searchOptions : searchOptions
        });
    } catch {
        res.redirect("/");
    }
});

// New Employee route
router.get("/new", async (req, res) => {
    const employee = {
        personId: "",
        firstName: "",
        lastName: "",
        postId: "",
        weeklyHours: "",
        employmentPeriod: "",
        baseSalary: ""
    }

    const posts = await Employee.getPosts();

    res.render("employees/new", { employee, posts });
});

// Create Employee route
router.post("/", async (req, res) => {
    const posts = await Employee.getPosts();
    console.log(posts);
    const rawEmployee = {
        personId: req.body.personId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        postId: req.body.postId,
        weeklyHours: req.body.weeklyHours,
        employmentPeriod: req.body.employmentPeriod,
        baseSalary: req.body.baseSalary,
    }

    let employee;
    try {
        employee = _dataValidation(rawEmployee, posts);
        await Employee.saveEmployees(employee);

        res.redirect("employees");
    } catch(error) {
        console.log("Error: " + error);
        res.render("employees/new", {
            employee: rawEmployee,
            posts: posts,
            errorMessage: error.message
        });
    }
});

function _dataValidation(employee, posts) {

    // Person ID validation
    employee.personId = employee.personId.trim();
    if (employee.personId.length == 0 ) throw Error("Personal ID field mandatory");
    if (employee.personId.length != 13) throw Error("Person ID field must be of 13 characters");
    if (!/^\d+$/.test(employee.personId)) throw Error("Person ID field can be made out of only digits");

    // First Name validation
    employee.firstName = employee.firstName.trim();
    if (employee.firstName.length == 0 ) throw Error("First Name field mandatory");
    if (employee.firstName.length > 20) throw Error("First Name field must not exceed 20 characters");
    if (!/^[a-zA-Z]+$/.test(employee.firstName)) throw Error("First Name field can be made out of only letters");

    // Last Name validation
    employee.lastName = employee.lastName.trim();
    if (employee.lastName.length == 0 ) throw Error("Last Name field mandatory");
    if (employee.lastName.length > 20) throw Error("Last Name field must not exceed 20 characters");
    if (!/^[a-zA-Z]+$/.test(employee.lastName)) throw Error("Last Name field can be made out of only letters");

    // Post validation
    const post = posts.find(obj => obj.name === employee.postId);
    employee.postId = post.postId;

    // Weekly Hours
    employee.weeklyHours = employee.weeklyHours.trim();
    if (employee.weeklyHours.length == 0 ) throw Error("Weekly Hours field mandatory");
    if (!/^\d+$/.test(employee.weeklyHours)) throw Error("Weekly Hours field can be made out of only digits");
    if (employee.weeklyHours.length > 2 ) throw Error("Weekly Hours must not exceed 2 digits");

    // Employment Period
    employee.employmentPeriod = employee.employmentPeriod.trim();
    if (employee.employmentPeriod.length == 0 ) throw Error("Employment Period field mandatory");
    if (!/^\d+$/.test(employee.employmentPeriod)) throw Error("Employment Period field can be made out of only digits");
    if (employee.employmentPeriod.length > 2 ) throw Error("Employment Period must not exceed 2 digits");

    // Base Salary
    employee.baseSalary = employee.baseSalary.trim();
    if (employee.baseSalary.length == 0 ) throw Error("Base Salary field mandatory");
    if (!/^[+-]?\d+(\.\d+)?$/.test(employee.baseSalary)) throw Error("Base Salary field can be made out of only digits, format 'n' or 'n.zz'");

    return employee;
}


module.exports = router;