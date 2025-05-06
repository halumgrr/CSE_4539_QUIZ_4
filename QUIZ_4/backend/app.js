const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const Users = require('./Models/users');
const Task = require('./Models/task');

const app = express()

// CORS middleware configuration
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const JWT_SECRET = "9f3a1e2c5a9b6cf11b2a4e4a6a7f1c9f8b9a7e3c5d6b2f1e3c7d9a1b2c3d4e5f";

mongoose
    .connect("mongodb://127.0.0.1:27017/usersDB")
    .then(() => {
        console.log("Connected to UsersDB");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err.message);
    });

app.listen(5000, () => {
    console.log("listening on port 5000");
});

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Remove 'Bearer ' prefix
    
    if (!token) return res.status(401).json({ error: "Access denied" });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid token" });
        req.user = user;
        next();
    });
};

// User registration
app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Name, email, and password are required" });
        }

        // Check if email already exists
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await Users.create({ 
            name, 
            email, 
            password: hashedPassword 
        });
        
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// User login
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Remove the type check since bcrypt.compare handles string conversion
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(400).json({ error: error.message });
    }
});

// Protect the /users route
app.get("/users", authenticateToken, async (req, res) => {
    try {
        const users = await Users.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post("/users", async (req, res) => {
    try {
        const user = await Users.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        console.log(error);
    }
});

app.put("/users/:uid", async (req, res) => {
    try {
        const { uid } = req.params;
        const updatedUser = await Users.findOneAndUpdate({ uid: uid }, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete("/users/:uid", async (req, res) => {
    try {
        const { uid } = req.params;
        const deletedUser = await Users.findOneAndDelete({uid : uid});
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Create a new task
app.post("/tasks", authenticateToken, async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            userId: req.user.id
        });
        const savedTask = await task.save();
        res.status(201).json(savedTask);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all tasks with filtering and sorting
app.get("/tasks", authenticateToken, async (req, res) => {
    try {
        const { priority, category, status, search, sortBy } = req.query;
        const query = { userId: req.user.id };

        // Apply filters
        if (priority) query.priority = priority;
        if (category) query.category = category;
        if (status) query.status = status;
        if (search) {
            query.$text = { $search: search };
        }

        // Apply sorting
        let sort = {};
        if (sortBy) {
            switch (sortBy) {
                case 'dueDate':
                    sort.dueDate = 1;
                    break;
                case 'priority':
                    sort.priority = 1;
                    break;
                case 'status':
                    sort.status = 1;
                    break;
            }
        }

        const tasks = await Task.find(query).sort(sort);
        res.status(200).json(tasks);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get a specific task
app.get("/tasks/:id", authenticateToken, async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            userId: req.user.id
        });
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update a task
app.put("/tasks/:id", authenticateToken, async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            req.body,
            { new: true }
        );
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a task
app.delete("/tasks/:id", authenticateToken, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Mark task as completed
app.patch("/tasks/:id/complete", authenticateToken, async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { status: 'completed' },
            { new: true }
        );
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

