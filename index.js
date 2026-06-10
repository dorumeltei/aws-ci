//Test setup:
//1. npm install -g nodemon
//2. add type": "module" to package.json
//3. npm install express && npm install
//npm install jsonwebtoken body-parser

import express from "express";
import bodyParser from "body-parser";
import jsonwebtoken from "jsonwebtoken";

const app = express();
// app.use(express.json());
app.use(bodyParser.json())

// Serving static files from the 'public' directory
app.use(express.static("public"));

// Define route to handle GET requests
app.get("/", function (req, res) {
  //   res.send("Hello World!");  
//   let html = "<img src='img/doru.png' />";
//   let key = "<a href='.secret/mypassword.txt'/>Secret key</a>"
//   res.send(html + key);
    res.json({message: "You reached the main route"});
});

// add middleware requests handling with app.use
app.use(function (req, res, next) {
  console.log("Request handled at: ", new Date());
  next();
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// build middleware for jwt token
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

// login route
const users = [
    {
        id: 1,
        username: "user1",
        password: "password1",
    },
    {
        id: 2,
        username: "user2",
        password: "password2",
    },
];

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const user = users.find(
        (u) => u.username === username && u.password === password
    );

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const token = jsonwebtoken.sign(
        { user: { id: user.id, username: user.username } },
        "your-secret-key",
        { expiresIn: "1h" }
    );

    res.json({ token });
});

//protect the route with JWT middleware
app.get("/protected-route", authenticateJWT, (req, res) => {
    res.json({ message: "This is a protected route" });
});

// Set up server listening; use default environment variable
//setup port or another port in the default is not set
const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log(`Server is running on port ${port}`);
});
