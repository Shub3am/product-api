/*
This is Assignemnt for Fleksa Assignment,
Considering a temporary array as database for now,
Will be hosting the code on github

Not Making a Seperate Routes folder but there's only one path to work on!
*/

interface ProductSchema {
  title: string;
  price: number;
  tags: [string];
  thumbnail: string;
}

const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true })); // for parsing request body
const database: ProductSchema[] = [];

app.get("/", (req, res) => {
  res.json(database);
});

app.get("/product/:id", (req, res) => {
  const id = req.params.id;
  if (id && !isNaN(id)) {
    database.forEach((product) => {
      if (product.id == id) {
        res.json(product); //This will invoke and end the request if the product is found
      }
    });
    res.json({ error: "404", message: "Product Not Found" }); //This will eventually run if the product is not found
  } else {
    res.json({ error: "400", message: "Check Your Parameters Again" });
  }

  // Here, If we were dealing with actual database, we could have done this with try and catch block, And Catch that DB adapter's particular error code
});

app.post("/product/new", (req, res) => {
  const { title, price, tags, thumbnail } = req.body;
  if (title && price && tags && thumbnail) {
    if (
      typeof title == String &&
      typeof thumbnail == String &&
      typeof price == Number
    ) {
      const checkExisting = database.filter((product) => {
        return product.title == title; //We are only checking for same title, we can also check for other details
      });
      if (!checkExisting.length) {
        database.push({ title, price, tags, thumbnail }); //This should be awaited/async
        res.json({ message: "Product Added Successfully" });
      }
    }
  }
});

app.listen("3000", () => {
  console.log("Dev Server Started at Port 3000");
});
