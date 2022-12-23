const express = require("express");
const router = express.Router();
const Menu = require("../models/Menu.class");

// All Menu route
router.get("/", async (req, res) => {
    const searchOptions = {};
    if (req.query.category != null && req.query.category !== "") {
        searchOptions.category = req.query.category.trim();
    }
    try {
        const menu = await Menu.getMenu(searchOptions);

        res.render("menu/index", {
            menu : menu,
            searchOptions : searchOptions
        });
    } catch {
        res.redirect("/");
    }
});

// New Menu route
router.get("/new", async (req, res) => {
    const dish = {
        dishId: "",
        foodName: "",
        category: "",
        weight: "",
        price: ""
    }

    res.render("menu/new", { dish });
});

// Create Menu route
router.post("/", async (req, res) => {
    const rawDish = {
        dishId: req.body.dishId,
        dishName: req.body.dishName,
        category: req.body.category,
        weight: req.body.weight,
        price: req.body.price
    }

    try {
        const dish = _dataValidation(rawDish);
        await Menu.saveDish(dish);

        res.redirect("menu");
    } catch(error) {
        console.log("Error: " + error);
        res.render("menu/new", {
            dish: rawDish,
            errorMessage: error.message
        });
    }
});

function _dataValidation(dish) {

    // Dish ID validation
    dish.dishId = dish.dishId.trim();
    if (dish.dishId.length == 0 ) throw Error("Dish ID field mandatory");
    if (dish.dishId.length != 5) throw Error("Dish ID field must be of 5 characters");
    if (!/^[a-zA-Z0-9]+$/.test(dish.dishId)) throw Error("Dish ID field can be made out of only digits and letters");

    // Dish Name validation
    dish.dishName = dish.dishName.trim();
    if (dish.dishName.length == 0 ) throw Error("Dish Name field mandatory");
    if (dish.dishName.length > 20) throw Error("Dish Name field must not exceed 20 characters");
    if (!/^[a-zA-Z]+$/.test(dish.dishName)) throw Error("Dish Name field can be made out of only letters");

    // Category validation
    dish.category = dish.category.trim();

    // Weight Hours
    dish.weight = dish.weight.trim();
    if (dish.weight.length == 0 ) throw Error("Weight field mandatory");
    if (!/^\d+$/.test(dish.weight)) throw Error("Weight field can be made out of only digits");
    if (dish.weight.length > 4 ) throw Error("Weight must not exceed 4 digits");

    // Price
    dish.price = dish.price.trim();
    if (dish.price.length == 0 ) throw Error("Base Salary field mandatory");
    if (!/^[+-]?\d+(\.\d+)?$/.test(dish.price)) throw Error("Base Salary field can be made out of only digits, format 'n' or 'n.zz'");

    return dish;
}


module.exports = router;