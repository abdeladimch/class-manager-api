require("express-async-errors");
require("dotenv").config();

const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();
const PORT = process.env.PORT || 7000;
const CookieParser = require("cookie-parser");

const errorHandler = require("./middlewares/errorHandler");
const notFound = require("./middlewares/notFound");

const helmet = require("helmet");
const cors = require("cors");
const rateLimiter = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const classRouter = require("./routes/class");

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 1000 * 60 * 15,
    max: 50,
  })
);

app.use(cors());
app.use(xss());
app.use(helmet());
app.use(mongoSanitize());

app.use(express.json());
app.use(CookieParser(process.env.JWT_SECRET));
app.use(express.static("public"));

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/classes", classRouter);

app.use(errorHandler);
app.use(notFound);

const connectDB = require("./db/connect");

connectDB(process.env.MONGO_URI);

mongoose.connection.once("open", () => {
  console.log("Connected to DB!");
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`);
  });
});
