/*
 * DATABASE INITIALIZATION SCRIPT
 * 
 * This script initializes the MongoDB database with sample chat data.
 * Run this script once to populate the database with initial chat messages.
 * 
 * MONGODB BULK INSERT OPERATION:
 * - insertMany() allows inserting multiple documents in a single operation
 * - More efficient than calling save() multiple times
 * - Returns an array of inserted documents with _id fields
 * - Useful for seeding databases with initial data
 */

const mongoose = require("mongoose");
// Import the Chat model to work with chat documents
const Chat = require("./models/chat");

/*
 * Connect to MongoDB database
 * Same connection process as in index.js
 */
main()
.then(() => {console.log("connection successful")})
.catch(err => console.log(err));

async function main() {
  // Connect to local MongoDB instance
  // 'whatsapp' database will be created if it doesn't exist
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

/*
 * Array of sample chat documents
 * These represent the structure of documents that will be inserted into MongoDB
 * Each object matches the schema defined in models/chat.js
 */
const allChats = [
    {
      from: "Alice",
      to: "Bob",
      msg: "Hey Bob! How are you?",
      created_at: new Date()  // automatically sets to current date & time
    },
    {
      from: "Bob",
      to: "Alice",
      msg: "Hi Alice! I'm good, thanks. What about you?",
      created_at: new Date()
    },
    {
      from: "Alice",
      to: "Bob",
      msg: "Doing well! Are you free to catch up later?",
      created_at: new Date()
    },
    {
      from: "Bob",
      to: "Alice",
      msg: "Sure, let's chat around 4 PM.",
      created_at: new Date()
    },
    {
      from: "Charlie",
      to: "Alice",
      msg: "Hey Alice, can you send me the notes?",
      created_at: new Date()
    }
  ];
  
/*
 * BULK INSERT OPERATION
 * 
 * Chat.insertMany() - Mongoose method for inserting multiple documents
 * - Inserts all documents in the array into the "chats" collection
 * - Returns a Promise that resolves with inserted documents (including _id)
 * - More efficient than individual save() calls
 * - Validates all documents against the schema before insertion
 * - If any document fails validation, operation may fail (depending on options)
 * 
 * Note: This operation is asynchronous but not awaited here.
 * In production, you'd want to await this or use .then()/.catch()
 */
Chat.insertMany(allChats);