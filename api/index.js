// index.js (backend)
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/user.js";
import path from "path";
const __dirname = path.resolve();
dotenv.config();

mongoose
  .connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((err) => {
    console.error(err);
  });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

// Middleware
app.use(express.json());

// API Endpoint
app.post("/api/admission", async (req, res) => {
  try {
    // Basic Validation
    const { name, age, selectedBatch } = req.body;
    if (!name || !age || !selectedBatch) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Check if the name is already in use
    const nameExists = await User.exists({ name });
    if (nameExists) {
      return res
        .status(400)
        .json({ success: false, message: "Name is already in use" });
    }

    // Check if the selected batch is already taken
    const batchExists = await User.exists({ selectedBatch });
    if (batchExists) {
      return res
        .status(400)
        .json({ success: false, message: "Selected batch is already full" });
    }

    // Save to MongoDB
    const newUser = new User({ name, age, selectedBatch });
    await newUser.save();

    // Call CompletePayment (mock function)
    // Assume paymentDetails is a placeholder for the payment information
    const paymentDetails = {
      /* Payment details */
    };
    const paymentResponse = CompletePayment(newUser, paymentDetails);

    // Return response to frontend based on payment response
    if (paymentResponse.success) {
      res.json({ success: true, message: "Admission successful" });
    } else {
      res.json({ success: false, message: "Payment failed" });
    }
  } catch (error) {
    console.error(error);

    // Check if the error is a duplicate key error (name already in use)
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "Name is already in use" });
    }

    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Mock function for payment (replace with actual implementation)
function CompletePayment(user, paymentDetails) {
  // Perform payment logic here
  // Return a mock response for now
  return { success: true, message: "Payment successful" };
}

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
