import mongoose from "mongoose";
const url = process.env.URL_Mongo_DB_For_Docker ?
    (process.env.URL_Mongo_DB_For_Docker + "/First_Database") :
    "mongodb://localhost:27017/First_Database";
const connectToMongoDB = () => {
    mongoose
        .connect(url)
        .then((res) => console.log(`Connected to MongoDB...`))
        .catch((error) => console.log(`Failed to connect to MongoDB: ${error}`));
};
export default connectToMongoDB;
