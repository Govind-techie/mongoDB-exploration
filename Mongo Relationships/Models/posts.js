/*
One-to-Many (One-to-Squillions) relationships in MongoDB using Mongoose allow a single document in one collection to be associated with many documents in another collection.
In this example, a User can have many Posts. This is implemented by storing a reference (ObjectId) of the User in each Post.
The `populate()` method helps by replacing the stored ObjectId in the Post with the actual User document, making it easier to access related data.
*/

const mongoose = require('mongoose');
const { Schema } = mongoose;

// Connect to MongoDB and handle connection success or errors
main()
    .then(() => { console.log("connection successful") })
    .catch((err) => console.log(err));

async function main() {
    // Connect to local MongoDB and use 'relationDemo' database
    await mongoose.connect('mongodb://127.0.0.1:27017/relationDemo');
}

// Define User schema with username and email fields
const userSchema = new Schema({
    username: { type: String, required: true }, // User's username
    email: { type: String, required: true }, // User's email
});

// Create User model based on userSchema
const User = mongoose.model("User", userSchema);

// Define Post schema with content, likes, and a reference to a User
const postSchema = new Schema({
    content: { type: String, required: true }, // Post content
    likes: { type: Number }, // Number of likes
    user: { type: Schema.Types.ObjectId, ref: "User" }, // Reference to User document
});

// Create Post model based on postSchema
const Post = mongoose.model("Post", postSchema);

// Function to add multiple users to the database
const addUser = async () => {
    let users = await User.insertMany([
        { username: "john_doe", email: "john@example.com" },
        { username: "alice_smith", email: "alice@example.com" },
        { username: "rohan_kumar", email: "rohan@example.com" },
    ]);
    console.log("Users added:", users);
};

addUser();

// Function to add posts linked to existing users using ObjectId references
const addPost = async () => {
    // Find users by their usernames to get their ObjectIds
    let users = await User.find({ username: { $in: ["john_doe", "alice_smith", "rohan_kumar"] } });

    // Create a map from username to user ObjectId for easy reference
    const userMap = {};
    users.forEach(u => {
        userMap[u.username] = u._id;
    });

    // Insert posts with user references to establish One-to-Many relationship
    let posts = await Post.insertMany([
        { content: "Learning MongoDB relationships!", likes: 10, user: userMap["john_doe"] },
        { content: "Exploring data modeling in Mongoose!", likes: 8, user: userMap["alice_smith"] },
        { content: "Understanding population and references!", likes: 12, user: userMap["rohan_kumar"] },
    ]);

    console.log("Posts added:", posts);
};

addPost();

// Function to find all posts and populate the user field with the username
const findUser = async () => {
    // Use populate() to replace user ObjectId with actual User document's username
    let posts = await Post.find({}).populate("user", "username"); // Only prints username field while populating.
    console.log(posts);
}

findUser();