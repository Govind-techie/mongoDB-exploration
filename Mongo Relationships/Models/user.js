const mongoose = require('mongoose');
const { Schema } = mongoose;

// Connect to MongoDB using Mongoose
// main() is an async function that connects to the database and handles connection success or errors
main()
    .then(() => { console.log("connnection successful") })
    .catch((err) => console.log(err));

async function main() {
    // Connect to the local MongoDB instance and use the 'relationDemo' database
    await mongoose.connect('mongodb://127.0.0.1:27017/relationDemo');
}

// Define the User schema with username and an array of addresses
const userSchema = new Schema({
    username: {
        type: String,
    },
    addresses: [
        {   
            // Disable automatic _id generation for subdocuments in addresses array
            // This is useful when the subdocuments do not need unique identifiers
            _id: false,
            location: {
                type: String,
            },
            city: {
                type: String,
            }
        },
    ],
});

// Create a Mongoose model named 'User' based on the userSchema
const User = mongoose.model("User", userSchema);

// Async function to create and save a new user document with embedded addresses
const addUser = async () => {
    let user1 = new User({
        username: "Bob",
        addresses: [
            { location: "123 Main St", city: "New York" },
            { location: "221B Baker Street", city: "London" }
        ]
    });
    // Log the user object before saving
    console.log(user1);
    // Save the user document to the database
    await user1.save();
    console.log("User saved successfully");
}

// Call the addUser function to execute the creation and saving of the user
addUser();