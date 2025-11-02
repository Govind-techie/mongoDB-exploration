/*
 * MONGOOSE SCHEMA & MODEL DEFINITION - CHAT MODEL
 * 
 * This file defines the structure and validation rules for chat documents
 * in MongoDB using Mongoose Schema.
 * 
 * KEY CONCEPTS:
 * 
 * 1. SCHEMA:
 *    - Defines the structure of documents in a collection
 *    - Acts as a blueprint for data validation
 *    - Maps to MongoDB collection structure
 * 
 * 2. SCHEMA TYPES:
 *    - String: Text data
 *    - Number: Numeric data
 *    - Date: Date and time data
 *    - Boolean: True/false values
 *    - ObjectId: Reference to another document
 *    - Array: Lists of values
 * 
 * 3. VALIDATION:
 *    - required: Field must be present when saving
 *    - maxLength: Maximum character length for strings
 *    - min: Minimum value for numbers
 *    - enum: Restricted to specific values
 *    - default: Value used if not provided
 * 
 * 4. MODEL:
 *    - Compiled schema that creates documents
 *    - Provides static methods (find, findById, etc.)
 *    - Provides instance methods (save, delete, etc.)
 *    - Mongoose pluralizes model name for collection (Chat -> chats)
 * 
 * 5. DOCUMENT:
 *    - Instance of a model (like an object created from a class)
 *    - Represents a single record in MongoDB
 *    - Has MongoDB _id field automatically assigned
 */

const mongoose = require("mongoose");

/*
 * Define the Schema for chat documents
 * Schema specifies the structure and validation rules for documents
 * Each field has a type and optional validation constraints
 */
const chatSchema = new mongoose.Schema({
    // Sender's name - required field
    from: {
        type: String,           // MongoDB will store this as a string
        required: true,          // Validation: must be provided when creating/saving
    },
    // Recipient's name - required field
    to: {
        type: String,
        required: true,
    },
    // Message content - optional field with max length constraint
    msg: {
        type: String,
        maxLength: 50,          // Validation: cannot exceed 50 characters
        // Note: If msg is not provided, it will be undefined (optional field)
    },
    // Timestamp when chat was created
    created_at: {
        type: Date,             // MongoDB stores dates as BSON Date objects
        required: true,
        default: Date.now,       // If not provided, uses current date/time
        // Date.now is a function reference - Mongoose calls it when needed
        // This ensures each document gets its creation timestamp
    }
});

/*
 * Create and export the Chat Model
 * 
 * mongoose.model() - Compiles the schema into a model
 * - First argument: Model name (singular, capitalized) - "Chat"
 * - Second argument: Schema definition - chatSchema
 * - MongoDB collection name: Automatically pluralized to "chats"
 * 
 * The Model provides methods to interact with the database:
 * - Chat.find() - Query multiple documents
 * - Chat.findById() - Find one document by ID
 * - Chat.create() - Create and save a document
 * - Chat.findByIdAndUpdate() - Update a document
 * - Chat.findByIdAndDelete() - Delete a document
 * 
 * Instance methods (on documents):
 * - chat.save() - Save the document to database
 * - chat.delete() - Delete the document
 */

const Chat = mongoose.model("Chat", chatSchema);

// Export the model so it can be imported and used in other files
module.exports = Chat;