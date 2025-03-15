import mongoose from "mongoose";

const url = "mongodb://localhost:27017/UserDetails";

// Connect to MongoDB with options
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Successfully connected to MongoDB..."))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Handle connection events
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB connection lost. Reconnecting...");
  mongoose.connect(url);
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});

mongoose.connection.on("reconnected", () => {
  console.log("🔄 MongoDB reconnected!");
});

export default mongoose;
