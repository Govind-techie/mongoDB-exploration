/*
  MONGOSE & JAVASCRIPT INTERACTION - EXPLANATORY NOTES
  
  What is Mongoose?
  - Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js
  - It provides a schema-based solution to model your application data
  - Mongoose translates JavaScript objects into MongoDB documents and vice versa
  
  Key Concepts:
  
  1. SCHEMA (JavaScript Object Definition)
     - Schema defines the structure of documents in a collection
     - It's a JavaScript object that describes what fields a document can have
     - Schema validations run in JavaScript before sending data to MongoDB
     - Example: const bookSchema = new mongoose.Schema({...})
  
  2. MODEL (JavaScript Class/Constructor)
     - Model is a JavaScript class/constructor compiled from Schema
     - You can create JavaScript instances from Model (like: new Book({...}))
     - Model provides methods to interact with MongoDB (save, find, update, etc.)
     - Example: const Book = mongoose.model("Book", bookSchema)
  
  3. DOCUMENT (JavaScript Instance)
     - Document is a JavaScript instance of a Model
     - Represents a single record in MongoDB
     - Can call methods like .save(), .validate(), etc. on it
     - Example: let book1 = new Book({title: "Atomic Habits"})
  
  4. VALIDATION (JavaScript-Level Rules)
     - Validations are JavaScript rules that check data before saving to MongoDB
     - They run in Node.js, not in MongoDB
     - If validation fails, Mongoose throws a JavaScript error (ValidationError)
     - This prevents invalid data from reaching the database
  
  5. IMMUTABLE FIELDS (JavaScript Protection)
     - Immutable fields cannot be modified after initial creation
     - This protection happens at the Mongoose/JavaScript level
     - Once a document is saved, immutable fields are locked
     - Attempts to update immutable fields are silently ignored or throw errors
  
  6. ASYNC OPERATIONS (JavaScript Promises)
     - All Mongoose operations (save, find, update) are asynchronous
     - They return Promises in JavaScript
     - Use .then()/.catch() or async/await to handle results
     - Example: book1.save().then(res => {...}).catch(err => {...})
  
  How Mongoose Bridges JavaScript and MongoDB:
  
  JavaScript Side         →      MongoDB Side
  Schema Definition       →      No direct equivalent (MongoDB is schema-less)
  Model.create()          →      db.collection.insertOne()
  document.save()         →      db.collection.insertOne() or updateOne()
  Model.find()            →      db.collection.find()
  Model.findByIdAndUpdate →      db.collection.findOneAndUpdate()
  Validation Errors       →      JavaScript errors (prevent DB write)
 */

const mongoose = require('mongoose');

// Connection Pattern: Using async/await with Promise chains
// Mongoose.connect() returns a Promise that resolves when connection is established
main()
    .then(() => {
        console.log("connection successful");
    })
    .catch(err => console.log(err));

async function main() {
    // Connecting to MongoDB database named "amazon"
    // This is an async operation that returns a Promise
    // We await it to ensure connection is established before proceeding
    await mongoose.connect('mongodb://127.0.0.1:27017/amazon');
};

// SCHEMA DEFINITION: JavaScript Object Structure for MongoDB Documents
// Schema validations: Rules for schema
// Schema defines what fields a document can have and their validation rules
// These validations run in JavaScript before data reaches MongoDB

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true, // JavaScript validation: Field must be provided, cannot be null/undefined
        maxLength: 20,  // JavaScript validation: Maximum 20 characters allowed
    },
    author: {
        type: String,
        immutable: true, // JavaScript protection: Once set, this field cannot be changed after first save
        // Note: Immutable fields prevent updates at the Mongoose level before reaching MongoDB
    },
    price: {
        type: Number,
        min: [1, "Price is too low"] // JavaScript validation: Minimum value is 1, custom error message
        // Format: [minValue, customErrorMessage]
        // If validation fails, Mongoose throws a ValidationError in JavaScript
    },
    discount: {
        type: Number,
        default: 0, // JavaScript default: If not provided, Mongoose sets this value automatically
        // Defaults are applied in JavaScript before saving to MongoDB
    },
    category: {
        type: String,
        enum: ["fiction", "non-fiction"], // JavaScript validation: Only allows these specific string values
        // Enum validation runs in JavaScript before database write
    },
    genre: [String], // Array of strings - JavaScript array type
    // No validation means any array of strings (including empty) is accepted
});

// MODEL CREATION: Converting Schema to JavaScript Constructor Function
// mongoose.model() compiles the schema into a JavaScript class/constructor
// First arg: Collection name in MongoDB (will be "books" - Mongoose pluralizes)
// Second arg: The schema object we defined above
// Returns: A JavaScript constructor function that we can use with 'new'
const Book = mongoose.model("Book", bookSchema);

// DOCUMENT CREATION: Creating JavaScript Instances from Model
// Using 'new' keyword creates a JavaScript object (document instance)
// This is similar to creating any JavaScript object from a class
// The object exists only in JavaScript memory until .save() is called
let book1 = new Book({
    title: "Atomic Habits",
    author: "James Clear",
    price: 500,
});

let book2 = new Book({
    title: "Deep Work",
    author: "Cal Newport",
    price: 699,
})

// SAVING DOCUMENTS: JavaScript to MongoDB Translation
// .save() method:
// 1. Runs all JavaScript validations defined in schema
// 2. Applies defaults if needed
// 3. Converts JavaScript object to MongoDB document format
// 4. Sends INSERT operation to MongoDB (if new) or UPDATE (if existing)
// 5. Returns a Promise that resolves with the saved document
// 
// Note: .save() is an async operation that returns a Promise
// If validation fails, it rejects the Promise with a ValidationError
book1.save()
.then((res) => {
    // Success: 'res' is the saved document (JavaScript object with _id from MongoDB)
    console.log(res)
})
.catch((err => {
    // Error: 'err' is a JavaScript error object (ValidationError, ConnectionError, etc.)
    console.log(err)
}));

book2.save()
.then((res) => {console.log(res)})
.catch((err => {console.log(err)}));

// UPDATING DOCUMENTS: Validation in Update Operations
// findByIdAndUpdate() method:
// 1. Finds a document by _id in MongoDB
// 2. Updates the document (MongoDB update operation)
// 3. Returns the document (old or new, based on 'new' option)
// 
// IMPORTANT: By default, validations DON'T run on update operations!
// You MUST set { runValidators: true } to trigger JavaScript schema validations
// 
// Parameters:
// - First: MongoDB document _id (string or ObjectId)
// - Second: Update object (using $set operator for clarity)
// - Third: Options object (runValidators, new, etc.)
// 
// Note: Options must be in a SINGLE object, not multiple objects!
// Wrong: {runValidators: true}, {new: true}
// Right: {runValidators: true, new: true}
Book.findByIdAndUpdate(
    '690774d4871eeb0b1fe32062', // MongoDB document ID to find
    {$set: {price: -100}},        // Update: Set price to -100 (triggers validation)
    {
        runValidators: true,      // CRITICAL: Enable JavaScript schema validations on update
        new: true                 // Return the updated document (not the old one)
    }
)
.then((res) => {
    // Success: 'res' is the updated document (or null if document not found)
    console.log(res)
})
.catch((err) => {
    // Error handling: Accessing validation error message structure
    // err.errors: Object containing field-specific validation errors
    // err.errors.price: Validation error for 'price' field
    // err.errors.price.properties.message: The custom error message we defined
    // Structure: err.errors[fieldName].properties.message
    console.log(err.errors.price.properties.message) // Prints: "Price is too low"
});