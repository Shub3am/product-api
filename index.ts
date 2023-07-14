/*
This is Assignemnt for Fleksa Assignment,
Considering a temporary array as database for now,
Will be hosting the code on github

Not Making a Seperate Routes folder but there's only one path to work on!
*/

interface ProductSchema {
  id: number; //We can use UUID for this or autoincrement
  title: string;
  price: number;
  tags: [string];
  thumbnail: string;
}

const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true })); // for parsing request body
let database: ProductSchema[] = [];

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
        database.push({
          title,
          price,
          tags,
          thumbnail,
          id: database.length + 1,
        }); //This should be awaited/async
        res.json({ message: "Product Added Successfully" });
      }
    }
  }
});

app.put("/product/:id", (req, res) => {
  let id = req.params.id;
  const { title, price, tags, thumbnail } = req.body; //We are assuming user wants to change one of these data
  let oldRecord = database.filter((product, index) => {
    if (product.id == id) {
      return { ...product, index: index };
    }
  });
  if (oldRecord) {
    switch (true) {
      case title:
        if (typeof title == String) {
          oldRecord.title = title;
          database[index] = { ...oldRecord, title: title }; //DB Adapters have better ways to update data, for eg("findOneandUpdate")
        }
      case price:
        if (typeof price == Number) {
          oldRecord.price = price;
          database[index] = { ...oldRecord, price: price }; //DB Adapters have better ways to update data, for eg("findOneandUpdate")
        }
      case thumbnail:
        if (typeof thumbnail == String) {
          oldRecord.thumbnail = thumbnail;
          database[index] = { ...oldRecord, thumbnail: thumbnail }; //DB Adapters have better ways to update data, for eg("findOneandUpdate")
        }
    }
  } //In Switch Statement, we are doing repitions, we can make a function to reuse it
  else {
    res.json({ error: 401, message: "Not Found" });
  }
});

app.delete("/product/:id", (req, res) => {
  let id = req.params.id;
  let checkRecords = database.filter((product, index) => {
    return product.id == id;
  });
  if (checkRecords) {
    let filteredDB = database.map((product, index) => {
      if (product.id !== id) {
        return product;
      }
    });
    database = filteredDB;
    res.json({ message: "Product Deleted Successfully" });
  } else {
    res.json({ error: 401, message: "Not Found" });
  }
});

app.listen("3000", () => {
  console.log("Dev Server Started at Port 3000");
});
