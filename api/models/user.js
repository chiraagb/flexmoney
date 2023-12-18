// models/user.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, unique: true }, // Adding unique constraint to the name field
  age: Number,
  selectedBatch: String,
});

const User = mongoose.model("User", userSchema);

export { User };
