const DBManager = require("./DBManager.class");
const Employee = require("../models/Employee.class");

const months = {
    January: '01',
    February: '02',
    March: '03',
    April: '04',
    May: '05',
    June: '06',
    July: '07',
    August: '08',
    September: '09',
    October: '10',
    November: '11',
    December: '12'
};

class Income {
    static async getDailyIncome(date) {
        const db = new DBManager;

        const sql = `SELECT employee.firstName, employee.lastName, sum(menu.price*bill_item.quantity) as earnings FROM bill_item
            LEFT JOIN menu ON bill_item.foodId = menu.dishId
            LEFT JOIN bill ON bill_item.billId = bill.billId
            LEFT JOIN employee ON bill.waiterId = employee.personId
            WHERE bill.date = ?
            GROUP BY bill.waiterId`

        const params = [date];

        return await db.runQuery(sql, params);
    }

    static async getMonthIncome(month) {
        const db = new DBManager;

        const sql = `SELECT sum(price) as income FROM bill WHERE date LIKE "____-${months[month]}-__%"`
        const params = [];

        console.log(sql);

        return await db.runQuery(sql, params);
    }

    
}

module.exports = Income;