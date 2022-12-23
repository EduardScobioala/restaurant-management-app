const DBManager = require("./DBManager.class");

class Employee {
    static async getEmployees(searchOptions) {
        const db = new DBManager;

        let sql, params;
        if (searchOptions.lastName) {
            sql = "SELECT * FROM employee WHERE upper(lastName) LIKE ?";
            params = [`${searchOptions.lastName.toUpperCase()}%`];
        }
        else {
            sql = "SELECT * FROM employee";
            params = [];
        }

        return await db.runQuery(sql, params);
    }

    static async saveEmployees(employee) {
        const db = new DBManager;

        const sql = "INSERT INTO employee (personId, firstName, lastName, postId, monthlyHours, employmentPeriod, baseSalary) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const params = [employee.personId, employee.firstName, employee.lastName, employee.postId, employee.monthlyHours, employee.employmentPeriod, employee.baseSalary];

        return await db.runQuery(sql, params);
    }

    static async getPosts() {
        const db = new DBManager;

        const sql = "SELECT * FROM post";
        const params = [];

        const result = await db.runQuery(sql, params);

        return result.map(value => {
            return { postId: value.postId, name: value.name }
        })
    }
}

module.exports = Employee;