import express from "express";
import jsonwebtoken from "jsonwebtoken";
import bodyParser from "body-parser";

const app = express();
const secretKey = "your-secret-key";

// Dummy user data for demonstration
const users = [
    { id: 1, username: "user1", password: "password1" },
    { id: 2, username: "user2", password: "password2" },
];

// Middleware to parse incoming requests as JSON
app.use(bodyParser.json());

// Login route to authenticate users and generate JWT tokens
app.post("/login", (req, res) => {
    // TODO: Handle login process
    const { username, password} = req.body;
    // console.log(username)
    const user = users.find(
        (u) => u.username === username && u.password === password
    );

    if (!user) return res.status(401).json({message: "Invalid user"})
    
    const token = jsonwebtoken.sign(
        {user: {id: user.id, username: user.username}},
        "your-secret-key",
        { expiresIn: '3h'}
    );

    res.json({ token });
});

// Middleware to authenticate JWT token
const authenticateJWT = (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, "your-secret-key");
        req.user = decoded.user;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Forbidden" });
    }
};

// Protected route that requires JWT authentication
app.get("/protected", authenticateJWT, (req, res) => {
    // TODO: Implement the protected route
    res.json({ message: "This is a protected route" });
});

// Root route
app.get("/", (req, res) => {
    res.json({ message: "You've reached the root route." });
});

app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});