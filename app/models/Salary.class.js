const DBManager = require("./DBManager.class");
const Employee = require("../models/Employee.class");

class Salary {
    static async getOvertimePayrollStatement(month, year) {
        const db = new DBManager;

        const sql = `SELECT employee.firstName, employee.lastName, overtimework.month, overtimework.year, overtimework.hours*overtimework.price as overtimePayment FROM employee
        LEFT JOIN overtimework ON employee.personId = overtimework.employeeId
        WHERE overtimework.month = ? AND overtimework.year = ?`
        const params = [month, year];

        return await db.runQuery(sql, params);
    }
}

module.exports = Salary;