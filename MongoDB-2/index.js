const mongoose = require('mongoose');

main()
    .then(() => {
        console.log("connection successful");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/test');

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
};

/* 
Note: 
Mongoose uses Operation Buffering
Mongoose lets you start using your models immediately, without waiting for mongoose to establish a connection to MongoDB.
*/

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number,
});

const User = mongoose.model("User", userSchema);

let user1 = User({name: "user_123", email: "user123@gmail.com", age: 15});
let user2 = User({name: "user_234", email: "user234@gmail.com", age: 21});

// Note: save method returns a promise.
user1.save();

user2.save()
.then((res) => {
    console.log("Data saved");
})
.catch((err) => {
    console.log(err);
});

// Inserting Multiple Documents
User.insertMany([
    {name: "Tony", email: "tony@gmail.com", age: 19},
    {name: "Peter", email: "peter123@gmail.com", age: 16},
    {name: "Bruce", email: "bruce908@yahoo.in", age: 32}
])
.then((res) => {
    console.log(res);
    console.log("Data Saved");
})
.catch((err) => {
    console.log(err);
});

/*
Note: 
Model.find() //returns a Query Object (thennable)
Mongoose Queries are not promises. But they have a .then() method.
*/

User.find({}) // Return all documents stored in collection
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(err);
    });

User.find({ age: { $gt: 18 } }) // Returns documents based on conditions
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(err);
    });

User.findById('69074ca54c773cd419857258')
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(err)
    });

// Update in mongoose
User.updateOne({ name: "Bruce" }, { age: 35 })
  .then((res) => console.log(res))
  .catch((err) => console.log(err));

User.updateMany({age: {$gt: 18}}, {age: 21})
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
});

//  // In this specfic method it first find and return the old value and then update the value.
User.findOneAndUpdate({name: "Bruce"}, {age: 32}, {new: true}) // Note: But when new sets to true it directly returns the modify values
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
});

// // Example: findByIdAndUpdate()
// // This method finds a document by its unique _id and updates it.
// // The { new: true } option ensures that the updated document is returned instead of the old one.
User.findByIdAndUpdate('69074e8e81d1da5edfe31a1f', { age: 40 }, { new: true })
  .then((res) => {
    console.log("Updated Document by ID:", res);
  })
  .catch((err) => {
    console.log(err);
  });

// Delete in Mongoose
User.deleteOne({name: "Bruce"})
.then((res) => {console.log(res)})
.catch((err) => {console.log(err)});


User.deleteMany({age: {$eq: 21}})
.then((res) => {console.log(res)})
.catch((err) => {console.log(err)});

// Example: findOneAndDelete()
// This method finds a document matching the given filter and deletes it.
// It returns the deleted document as the result.
User.findOneAndDelete({ name: "user_123" })
  .then((res) => {
    console.log("Deleted Document using findOneAndDelete:", res);
  })
  .catch((err) => {
    console.log(err);
  });

// Example: findByIdAndDelete()
// This method finds a document by its unique _id and deletes it.
// Replace the _id with the one present in your database.
User.findByIdAndDelete('69074e8e81d1da5edfe31a1e')
  .then((res) => {
    console.log("Deleted Document using findByIdAndDelete:", res);
  })
  .catch((err) => {
    console.log(err);
  });

