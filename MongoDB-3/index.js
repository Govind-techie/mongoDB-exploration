/*
 * MONGODB & MONGOOSE WITH EXPRESS.JS - WHATSAPP CHAT APPLICATION
 * 
 * This is a RESTful web application demonstrating MongoDB database operations
 * using Mongoose ODM (Object Document Mapper) with Express.js framework.
 * 
 * KEY CONCEPTS DEMONSTRATED:
 * 
 * 1. MONGODB CONNECTION:
 *    - MongoDB is a NoSQL document database that stores data in BSON (Binary JSON) format
 *    - Connection string format: mongodb://[host]:[port]/[database-name]
 *    - Mongoose wraps MongoDB driver providing schema-based modeling and validation
 * 
 * 2. MONGOOSE OPERATIONS:
 *    - Schema Definition: Defines structure and validation rules for documents
 *    - Models: Blueprint for creating MongoDB documents (like a class in OOP)
 *    - CRUD Operations: Create, Read, Update, Delete operations on documents
 *      * Create: new Model() + .save() or Model.create()
 *      * Read: Model.find(), Model.findById()
 *      * Update: Model.findByIdAndUpdate(), Model.updateOne()
 *      * Delete: Model.findByIdAndDelete(), Model.deleteOne()
 * 
 * 3. EXPRESS.JS ROUTING:
 *    - Express handles HTTP requests and responses
 *    - RESTful routes follow CRUD patterns (GET, POST, PUT, DELETE)
 *    - EJS (Embedded JavaScript) template engine renders dynamic HTML
 * 
 * 4. MIDDLEWARE:
 *    - express.urlencoded: Parses form data from POST requests
 *    - method-override: Allows using PUT/DELETE methods via HTML forms
 *    - express.static: Serves static files (CSS, JS, images)
 * 
 * DATABASE STRUCTURE:
 * - Database: "whatsapp"
 * - Collection: "chats" (automatically pluralized by Mongoose from "Chat" model)
 * - Documents: Individual chat messages with fields: from, to, msg, created_at
 */

// Import Express.js - Web framework for Node.js that handles HTTP requests/responses
const express = require("express");
// Create Express application instance
const app = express();
// Define server port
const port = 8080;

// Import Mongoose - ODM (Object Document Mapper) for MongoDB
// Mongoose provides schema-based solution to model application data
const mongoose = require("mongoose");
// Import Node.js path module for file path operations
const path = require("path");
// Import Chat model - Mongoose model representing the chat collection in MongoDB
// Models are constructors compiled from Schema definitions
const Chat = require("./models/chat.js");
// Import method-override - Middleware to use HTTP verbs like PUT/DELETE in places
// where the client doesn't support it (like HTML forms)
const methodOverride = require("method-override");

// Configure EJS (Embedded JavaScript) as the view engine
// EJS allows embedding JavaScript code in HTML templates
app.set("view engine", "ejs");
// Set directory where EJS template files are located
app.set("views", path.join(__dirname, "/views"));

// Serve static files (CSS, JavaScript, images) from the public directory
// Static files are served directly without processing
app.use(express.static(path.join(__dirname, "/public")));

// Middleware to parse URL-encoded bodies from HTML forms
// extended: true allows parsing rich objects and arrays
// This makes req.body available in POST requests
app.use(express.urlencoded({ extended: true }));

// Middleware to override HTTP method in HTML forms
// HTML forms only support GET and POST, this allows PUT/DELETE via ?_method=PUT
app.use(methodOverride('_method'));

// Establish connection to MongoDB database
// main() is an async function because mongoose.connect() returns a Promise
main()
    .then(() => { console.log("connection successful") })
    .catch(err => console.log(err));

/**
 * Async function to connect to MongoDB using Mongoose
 * - mongodb://127.0.0.1:27017 is the default local MongoDB connection string
 * - 'whatsapp' is the database name (will be created if it doesn't exist)
 * - Mongoose manages connection pooling automatically
 */
async function main() {
    // mongoose.connect() establishes connection to MongoDB
    // Returns a Promise that resolves when connection is established
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

// EXAMPLE: Creating and Saving a Document to MongoDB
// This demonstrates the basic CREATE operation in Mongoose:
// 1. Create a new instance using the Model constructor (new Chat())
// 2. Save it to the database using .save() method
// Note: MongoDB automatically generates a unique _id for each document
let chat1 = new Chat({
    from: "Adam",
    to: "Eve",
    msg: "Send me your notes please.",
    created_at: new Date() // Creates a new date when we call a date constructor
})

chat1.save()
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
})


// RESTful ROUTES - CRUD OPERATIONS

/*
 * INDEX ROUTE - READ ALL (GET)
 * Route: GET /chats
 * Purpose: Retrieve and display all chat documents from MongoDB
 * 
 * Mongoose Operation: Chat.find()
 * - find() without parameters retrieves ALL documents from the collection
 * - Returns a Promise, so we use async/await or .then()
 * - Returns an array of documents matching the query (empty array if none)
 * - Documents are plain JavaScript objects with MongoDB _id field
 */
app.get("/chats", async (req, res) => {
    // Chat.find() queries the MongoDB "chats" collection (pluralized automatically)
    // As .find() functions fetch data from DB through Chat model, it's an async function
    let chats = await Chat.find();
    console.log(chats);
    // Render EJS template with chats data
    // The { chats } object is passed to the template as local variables
    res.render("index.ejs", { chats });
})


/*
 * NEW ROUTE - CREATE FORM (GET)
 * Route: GET /chat/new
 * Purpose: Display form to create a new chat message
 * 
 * This route doesn't interact with MongoDB - it just serves the form page
 */
app.get("/chat/new", (req, res) => {
    res.render("new.ejs");
})

/*
 * CREATE ROUTE - CREATE (POST)
 * Route: POST /chats
 * Purpose: Save a new chat document to MongoDB
 * 
 * Mongoose Operation: new Model() + .save()
 * - Create a new document instance from the model
 * - Call .save() to persist it to the database
 * - .save() validates the data against the schema before saving
 * - Returns a Promise that resolves with the saved document
 */
app.post("/chats", (req, res) => {
    // Extract form data from request body (parsed by express.urlencoded middleware)
    let { from, to, msg } = req.body;
    // Create a new Chat document instance
    // Mongoose validates this against the schema defined in models/chat.js
    const chat = new Chat({ from, to, msg, created_at: new Date() });
    // Save the document to MongoDB
    chat.save()
        .then(() => {
            console.log("Chat Saved")
            // Redirect to index page to show all chats
            res.redirect("/chats");
        })
        .catch(err => {
            // Handle validation errors or database errors
            console.log(`Chat NOT saved: ${err}`);
            res.status(500).send("Unable to save chat");
        });
});

/*
 * EDIT ROUTE - UPDATE FORM (GET)
 * Route: GET /chat/:id/edit
 * Purpose: Display form to edit an existing chat message
 * 
 * Mongoose Operation: Chat.findById()
 * - findById() retrieves a single document by its MongoDB _id
 * - :id is a route parameter extracted from the URL
 * - Returns null if document doesn't exist
 */
app.get("/chat/:id/edit", async (req, res) => {
    // Extract ID from URL parameters (e.g., /chat/507f1f77bcf86cd799439011/edit)
    let { id } = req.params
    // Query MongoDB for document with matching _id
    // MongoDB ObjectIds are unique identifiers automatically assigned to each document
    const chat = await Chat.findById(id);
    // Render edit template with the chat document data
    res.render("edit.ejs", { chat });
});

/*
 * UPDATE ROUTE - UPDATE (PUT)
 * Route: PUT /chat/:id
 * Purpose: Update an existing chat document in MongoDB
 * 
 * Mongoose Operation: Chat.findByIdAndUpdate()
 * - Updates a document identified by _id
 * - $set operator updates only specified fields (partial update)
 * - Without $set, would replace entire document
 * - Returns the updated document by default
 */
app.put("/chat/:id", async (req, res) => {
    // Extract ID and updated message from request
    let { id } = req.params;
    let { msg } = req.body;
    // Update the document in MongoDB
    // $set: {msg} - MongoDB update operator that sets the msg field
    // This performs a partial update, only changing the msg field
    await Chat.findByIdAndUpdate(id, {$set: {msg}}, {runValidators: true}, {new: true});
    // Redirect to index page to show updated list
    res.redirect("/chats");
});

/*
 * DELETE ROUTE - DELETE (DELETE)
 * Route: DELETE /chat/:id
 * Purpose: Remove a chat document from MongoDB
 * 
 * Mongoose Operation: Chat.findByIdAndDelete()
 * - Deletes a document identified by _id
 * - Returns the deleted document
 * - If document doesn't exist, returns null
 */
app.delete("/chat/:id", async(req, res) => {
    // Extract ID from URL parameters
    let { id } = req.params;
    // Delete the document from MongoDB
    await Chat.findByIdAndDelete(id);
    // Redirect to index page to show remaining chats
    res.redirect("/chats");
});

/*
 * ROOT ROUTE
 * Route: GET /
 * Purpose: Simple test route to verify server is running
 */
app.get("/", (req, res) => {
    res.render("home.ejs");
});

/*
 * START SERVER
 * Listens for incoming HTTP requests on the specified port
 * Callback executes once server starts listening
 */
app.listen(port, () => {
    console.log(`listening at port ${port}`);
});