var mysql = require("mysql");

class PrivateDBManager {
    constructor() {
        this.connection = this.getConnection();
    }

    getConnection() {
        return mysql.createConnection({
            user: "root",
            host: "localhost",
            password: "littlewhale",
            database: "restaurant-management"
        });
    }
}

class DBConnection {
    constructor() {
        throw new Error('Use DBManager.getInstance()');
    }

    static getInstance() {
        if (!DBConnection.instance) {
            DBConnection.instance = new PrivateDBManager();
        }
        return DBConnection.instance.connection;
    }
}

module.exports = DBConnection;