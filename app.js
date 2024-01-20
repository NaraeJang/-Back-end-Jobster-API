require("dotenv").config();
require("express-async-errors");

const path = require("path");

// extra security packages
const helmet = require("helmet");
const xss = require("xss-clean");
// We delete cors and rate limiter. Since we have front-end for this project, we only want to have the access to front-end. that's why we don't need cors. For limiter, we will apply to register and login only.

const express = require("express");
const app = express();

const connectDB = require("./db/connect");
const authenticateUser = require("./middleware/authentication");

// routers
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");
// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// front-end
app.use(express.static(path.resolve(__dirname, "./client/build")));

// securities
app.use(express.json());
app.use(helmet());
app.use(xss());

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter); // serve index.html has to be later than this routes. so that we can use this one. order is important!

// serve index.html
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
