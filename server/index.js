const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserModel = require("./models/User");
const ArtistModel = require("./models/Artist");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://127.0.0.1:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());

mongoose.connect("mongodb://localhost:27017/ceme-database");

// Middleware
const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.statusCode = 401;
    return res.json("The token was not available");
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) {
        res.statusCode = 401;
        return res.json("Token is wrong");
      }
      next();
    });
  }
  console.log(token);
};

app.get("/home", verifyUser, (req, res) => {
  return res.json("Success");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email: email });

  if (!user) {
    return res.status(401).json("Invlaid credentials.");
  }

  bcrypt.compare(password, user.password, (err, isMatching) => {
    if (!isMatching) {
      return res.status(401).json("Invlaid credentials.");
    }

    const token = jwt.sign({ email: user.email }, "jwt-secret-key", {
      expiresIn: "1d",
    });

    return res
      .cookie("token", token, {
        httpOnly: false,
        sameSite: "None",
        secure: true,
      })
      .json("Success");
  });
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      UserModel.create({ name, email, password: hash })
        .then((employees) => res.json(employees))
        .catch((err) => res.json(err));
    })
    .catch((err) => console.log(err.message));
});

app.post("/artists", (req, res) => {
  ArtistModel.create(req.body)
    .then((artists) => res.json(artists))
    .catch((err) => res.json(err));
});

app.get("/artists", verifyUser, async (req, res) => {
  try {
    let { page, size, searchTerm } = req.query;

    if (!page) {
      page = 1;
    }
    if (!size) {
      size = 10;
    }

    const limit = parseInt(size);
    const skip = (page - 1) * size;

    let query = {};
    if (searchTerm) {
      query = {
        $or: [
          { firstName: { $regex: searchTerm, $options: "i" } },
          { lastName: { $regex: searchTerm, $options: "i" } },
          { position: { $regex: searchTerm, $options: "i" } },
        ],
      };
    }

    const total = await ArtistModel.count(query);
    const artists = await ArtistModel.find(query, {}, { limit, skip });
    return res.send({ data: artists, total });
  } catch (err) {
    console.error(err);
    return res.status(418).json(err);
  }
});

// /artists?page=1
// page, limit, search
const primerResponsea = {
  data: [{}, {}],
  page: 1,
  limit: 10,
  total: 80,
};

// app.get("/artist/:id", (req, res) => {
//   // GET ALL Artists
// });

app.listen(3001, () => {
  console.log("server is running");
});
