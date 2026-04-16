import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import researchRoutes from "./routes/researchRoutes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/api/research", researchRoutes);
// Test Route
app.get("/", (req, res) => {
  res.send("Curalink Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
