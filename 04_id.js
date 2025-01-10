const express = require('express');
const { MongoClient } = require('mongodb');
const {ObjectId} = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection details
const uri = "mongodb://127.0.0.1:27017"; 
const dbName = "agg_0";

// Middleware
app.use(express.json());

let db, courses;

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        courses = db.collection("courses");

        // Start server after successful DB connection
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Exit if database connection fails
    }
}

// Initialize Database
initializeDatabase();

// Routes

// GET: List all courses
app.get('/courses', async (req, res) => {
    try {
        const allcourses = await courses.find().toArray();
        res.status(200).json(allcourses);
    } catch (err) {
        res.status(500).send({ message: "Error fetching courses", error: err.message });
    }
});

// POST: Add a new course
app.post('/courses', async (req, res) => {
    try {
        const newcourse = req.body;
        const result = await courses.insertOne(newcourse);
        res.status(201).send({ message: `Course added with ID: ${result.insertedId}` });
    } catch (err) {
        res.status(500).send({ message: "Error adding course", error: err.message });
    }
});

// PUT: Update a course completely
app.put('/courses/:_id', async (req, res) => {
    try {
        const _id = new ObjectId(req.params._id);
        const updatedcourse = req.body;

        if (!updatedcourse || Object.keys(updatedcourse).length === 0) {
            return res.status(400).send({ message: "Invalid request: No data provided to update" });
        }

        const result = await courses.replaceOne({ _id }, updatedcourse);

        if (result.matchedCount === 0) {
            return res.status(404).send({ message: "Course not found" });
        }

        res.status(200).send({ message: `${result.modifiedCount} document(s) updated` });
    } catch (err) {
        res.status(500).send({ message: "Error updating course", error: err.message });
    }
});

// PATCH: Partially update a course
app.patch('/courses/:_id', async (req, res) => {
    try {
        const _id = new ObjectId(req.params._id);
        const updates = req.body;
        const result = await courses.updateOne({ _id }, { $set: updates });

        if (result.matchedCount === 0) {
            return res.status(404).send({ message: "Course not found" });
        }

        res.status(200).send({ message: `${result.modifiedCount} document(s) updated` });
    } catch (err) {
        res.status(500).send({ message: "Error partially updating course", error: err.message });
    }
});


// DELETE: Remove a course
app.delete('/courses/:_id', async (req, res) => {
    try {
        const _id = new ObjectId(req.params._id);
        const result = await courses.deleteOne({ _id });

        if (result.deletedCount === 0) {
            return res.status(404).send({ message: "Course not found" });
        }

        res.status(200).send({ message: `${result.deletedCount} document(s) deleted` });
    } catch (err) {
        res.status(500).send({ message: "Error deleting course", error: err.message });
    }
});