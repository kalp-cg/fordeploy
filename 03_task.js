const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

const uri = "mongodb://localhost:27017/"; 
const dbName = "agg_0";

app.use(express.json());

let db, courses;

async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        courses = db.collection("courses");

        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    }
}

// Initialize Database
initializeDatabase();

// Routes

// GET: List all courses
app.get('/courses', async (req, res) => {
    try {
        const allCourses = await courses.find().toArray();
        res.status(200).json(allCourses);
    } catch (err) {
        res.status(500).send("Error fetching courses: " + err.message);
    }
});

// POST: Add a new course
app.post('/courses', async (req, res) => {
    try {
        const newCourse = req.body;
        const result = await courses.insertOne(newCourse);
        res.status(201).send(`Course added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding course: " + err.message);
    }
});

// PUT: Update a course completely
app.put('/courses/:courseCode', async (req, res) => {
    try {
        console.log(req.body);
        console.log(req.params);
        const courseCode = (req.params.courseCode);
        console.log(courseCode);
        const updatedCourse = req.body;
        const result = await courses.replaceOne({ courseCode }, updatedCourse);
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error updating course: " + err.message);
    }
});

// PATCH: Partially update a course
app.patch('/courses/:courseCode', async (req, res) => {
    try {
        const courseCode = (req.params.courseCode);
        const updates = req.body;
        const result = await courses.updateOne({ courseCode }, { $set: updates });
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error partially updating course: " + err.message);
    }
});

// DELETE: Delete a course by course_name
app.delete('/courses/v1/:course_name', async (req, res) => {
    try {
        const course_name = req.params.course_name;
        const result = await courses.deleteOne({ course_name });
        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        res.status(500).send("Error deleting course: " + err.message);
    }
});

// DELETE: Delete a course by course_id
app.delete('/courses/:course_id', async (req, res) => {
    try {
        const course_id = parseInt(req.params.course_id);
        const result = await courses.deleteOne({ course_id });
        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        res.status(500).send("Error deleting course: " + err.message);
    }
});
