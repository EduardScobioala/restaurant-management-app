const DBConnection = require("./DBConnection.class");

class DBManager {
    constructor() {
        this.connection = DBConnection.getInstance();
    }

    runQuery(sql, params) {
        return new Promise((res, rej) => {
            this.connection.query(sql, params, function (error, result, fields) {
                if (error) rej(error.message);
                res(result);
            });
        })
        
    }
}

module.exports = DBManager;