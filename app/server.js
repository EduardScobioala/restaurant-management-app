const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");

const indexRouter = require("./routes/index");
// const clientsRouter = require("./routes/customer");
// const productsRouter = require("./routes/product");
// const transactionsRouter = require("./routes/transaction");

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
// app.use("/customers", clientsRouter);
// app.use("/products", productsRouter);
// app.use("/transactions", transactionsRouter);

app.listen(8080, () => {
    console.log("Listening on port 8080...");
});
