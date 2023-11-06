import mongoose from "mongoose"

const db = "mongodb+srv://Alex:55555@atlascluster.ff0zduv.mongodb.net/";
mongoose
  .connect(db)
  .then((res) => console.log(`Connected to MongoDB...`))
  .catch((error) => console.log(`failed to connect to MongoDB: ${error}`));


