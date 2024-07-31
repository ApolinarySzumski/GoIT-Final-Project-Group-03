// npm modules
import cors from "cors";
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";

// my modules
import ingredientsRoute from "./routes/ingredients.js";
import othersRoute from "./routes/others.js";
import recipiesRoute from "./routes/recipies.js";

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(express.json());
app.use(cors());
app.use(morgan(formatsLogger));

app.use("/ingredients", ingredientsRoute);
app.use("/", othersRoute);
app.use("/recipes", recipiesRoute);

app.use((_, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((error, _, res, __) => {
  res.status(500).json({ message: error.message });
});

const PORT = process.env.PORT || 8000;
const uriDb = process.env.DB_HOST;

// Funtion used to connection with database and running server
const connect = async () => {
  try {
    await mongoose.connect(uriDb, { dbName: "So-Yummy" });
    app.listen(PORT, () =>
      console.log(`Server running. Use our API on port ${PORT}`),
    );
  } catch (error) {
    console.log(`Something went wrong, full error is: ${error}`);
    process.exit(1);
  }
};

// Funtion to inform developer about database answers
const registerListeners = () => {
  mongoose.connection.on("connected", () =>
    console.log("Database connection successful"),
  );
  mongoose.connection.on("disconnected", () =>
    console.log("Database connection is broken"),
  );
};

// Calling necessary funtions, order of calling is important
registerListeners();
connect();