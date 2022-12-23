const DBManager = require("./DBManager.class");

class Overtime {
    static async getOvertime(searchOptions) {
        const db = new DBManager;

        let sql, params;
        if (searchOptions.month) {
            sql = "SELECT * FROM overtimework WHERE upper(month) LIKE ?";
            params = [`${searchOptions.month.toUpperCase()}%`];
        }
        else {
            sql = "SELECT * FROM overtimework";
            params = [];
        }

        return await db.runQuery(sql, params);
    }

    static async saveOvertime(overtime) {
        const db = new DBManager;

        const sql = "INSERT INTO overtimework VALUES (?, ?, ?, ?, ?)";
        const params = [overtime.employeeId, overtime.month, overtime.year, overtime.hours, overtime.price];

        return await db.runQuery(sql, params);
    }
}

module.exports = Overtime;