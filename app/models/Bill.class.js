const DBManager = require("./DBManager.class");

class Bill {
    static async getBills(searchOptions) {
        const db = new DBManager;

        let sql, params;
        if (searchOptions.lastName) {
            sql = `SELECT * FROM bill LEFT JOIN employee ON bill.waiterId = employee.personId
                WHERE employee.lastName LIKE ?`;
            params = [`${searchOptions.lastName.toUpperCase()}%`];
        }
        else {
            sql = "SELECT * FROM bill";
            params = [];
        }

        return await db.runQuery(sql, params);
    }

    static async saveBill(bill, menu) {
        const db = new DBManager;

        // Count the dishes
        const dishCounts = bill.dish.reduce((total, item) => {
            if (item in total)  total[item]++;
            else total[item] = 1;
            return total;
        }, {});

        const entries = Object.entries(dishCounts);
        // Add every dish to the bill-item table in DB
        for(let i = 0; i < entries.length; i++) {
            const dish = menu.find(obj => obj.dishName == entries[i][0]);

            const sql = "INSERT INTO bill_item VALUES (?, ?, ?)";
            const params = [bill.billId, dish.dishId, entries[i][1]];

            await db.runQuery(sql, params);
        }

        // Calculate the price of the bill
        let price = 0;
        for(let i = 0; i < entries.length; i++) {
            const dish = menu.find(obj => obj.dishName == entries[i][0]);
            price += parseFloat(dish.price) * entries[i][1];
        }

        // Add the bill to the DB
        const sql = "INSERT INTO bill VALUES (?, ?, ?, ?)";
        const params = [bill.billId, bill.employeeId, bill.date, price];
        await db.runQuery(sql, params);
    }
}

module.exports = Bill;