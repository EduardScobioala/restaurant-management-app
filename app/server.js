const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");

const indexRouter = require("./routes/index");
const employeesRouter = require("./routes/employee");
const menuRouter = require("./routes/menu");
const billsRouter = require("./routes/bill");
const overtimeRouter = require("./routes/overtime");
const salaryRouter = require("./routes/salary");
const incomeRouter = require("./routes/income");

// layout/views setup
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);

app.use(express.static('public'))
app.use(bodyParser.urlencoded());

// connect to db
const DBConnection = require("./models/DBConnection.class");
const db = DBConnection.getInstance();
db.connect((error) => {
    if (error) console.log(`Error: ${error.message}`)
    else console.log("Connected to MySQL Server");
});

// main router
app.use("/app", indexRouter);
app.use("/employees", employeesRouter);
app.use("/menu", menuRouter);
app.use("/bills", billsRouter);
app.use("/overtime", overtimeRouter);
app.use("/salary", salaryRouter);
app.use("/income", incomeRouter);

app.listen(8080, () => {
    console.log("Listening on port 8080...");
});
