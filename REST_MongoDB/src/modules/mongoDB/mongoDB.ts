import mongoose from "mongoose"

const db = "mongodb://localhost:27017";

const connectToMongoDB = () => {
  mongoose
    .connect(db)
    .then((res) => console.log(`Connected to MongoDB...`))
    .catch((error) => console.log(`failed to connect to MongoDB: ${error}`));
};

export default connectToMongoDB;
