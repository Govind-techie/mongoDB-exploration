/*
  This file demonstrates a One-to-Many relationship using Mongoose in MongoDB.
  It shows how one Customer can have many Orders by referencing Order documents.
  Mongoose ObjectId references are used to link Orders to Customers.
  The populate() method is used to retrieve related Order data when querying Customers.
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

// Connect to MongoDB using Mongoose
// main() is an async function that connects to the database and handles connection success or errors
main()
    .then(() => { console.log("connection successful") }) // Log success message on connection
    .catch((err) => console.log(err)); // Log any connection errors

async function main() {
    // Connect to the local MongoDB instance and use the 'relationDemo' database
    await mongoose.connect('mongodb://127.0.0.1:27017/relationDemo');
}

// Define the Order schema with item name and price fields
const orderSchema = new Schema({
    item: {
        type: String, // Name of the item ordered
    },
    price: {
        type: Number, // Price of the item
    },
});

// Define the Customer schema with name and an array of order references
const customerSchema = new Schema({
    name: {
        type: String,
        required: true, // Customer name is required
    },
    orders: [
        {
            type: Schema.Types.ObjectId, // Reference to Order document
            ref: "Order", // Reference model name
        },
    ],
});

const Order = mongoose.model("Order", orderSchema); // Create Order model

// Function to add multiple orders to the database
const addOrders = async () => {
    let order = await Order.insertMany([
        { item: "Laptop", price: 1200 },
        { item: "Headphones", price: 150 },
        { item: "Keyboard", price: 80 },
        { item: "Monitor", price: 300 }
    ]);
    console.log("order saved successfully"); // Confirm orders saved
    console.log(order); // Log saved order documents
}

addOrders(); // Call function to add orders

const Customer = mongoose.model("Customer", customerSchema); // Create Customer model

// Function to add customers with references to orders
const addCustomers = async () => {
    // Find orders matching the specified items
    const orders = await Order.find({ item: { $in: ["Laptop", "Headphones", "Keyboard", "Monitor"] } });
  
    // Create a map of item names to their ObjectIds for easy reference
    const orderMap = {};
    orders.forEach(o => orderMap[o.item] = o._id);
  
    // Insert customers with order references using the ObjectIds
    await Customer.insertMany([
      {
        name: "Bob",
        orders: [orderMap["Laptop"], orderMap["Headphones"], orderMap["Keyboard"]],
      },
      {
        name: "Alice",
        orders: [orderMap["Monitor"]],
      },
    ]);
  
    console.log("Customers saved successfully!"); // Confirm customers saved
  };

addCustomers(); // Call function to add customers

// Function to find customers and populate their orders
const findCustomer = async () => {
    // Find all customers and populate the orders field with actual order documents
    let customers = await Customer.find({}).populate("orders");
    console.log(customers[0]); // Log the first customer with populated orders
}

findCustomer(); // Call function to find and display customer data with orders