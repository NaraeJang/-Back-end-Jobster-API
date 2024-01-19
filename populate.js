require("dotenv").config();

const connectDB = require("./db/connect");
const Job = require("./models/Job");

const jsonJobList = require("./mock_data.json");

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    await Job.deleteMany();
    await Job.create(jsonJobList);

    console.log("Success! I will exit the application now! BYE :)");

    process.exit(0);
  } catch (error) {
    console.log(error);
    console.log("Something went wrong... Please check your code");

    process.exit(1);
  }
};

start();
