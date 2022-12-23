const DBManager = require("./DBManager.class");

class Menu {
    static async getMenu(searchOptions) {
        const db = new DBManager;

        let sql, params;
        if (searchOptions.category) {
            sql = "SELECT * FROM menu WHERE upper(category) LIKE ?";
            params = [`${searchOptions.category.toUpperCase()}%`];
        }
        else {
            sql = "SELECT * FROM menu";
            params = [];
        }

        return await db.runQuery(sql, params);
    }

    static async saveDish(dish) {
        const db = new DBManager;

        const sql = "INSERT INTO menu VALUES (?, ?, ?, ?, ?)";
        const params = [dish.dishId, dish.dishName, dish.category, dish.weight, dish.price];

        return await db.runQuery(sql, params);
    }
}

module.exports = Menu;