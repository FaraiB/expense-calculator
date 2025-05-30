const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { testConnection, syncDatabase } = require("./config/database");
const expenseRoutes = require("./routes/expenses");
const errorHandler = require("./middleware/errorHandler");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Expense Calculator API" });
});

// Expense routes
app.use("/api/expenses", expenseRoutes);

// Error handling middleware (must be after routes)
app.use(errorHandler);

// Initialize database and start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    console.log("Database connection successful");

    // Sync database tables
    await syncDatabase();
    console.log("Database sync successful");

    // Start server
    const PORT = process.env.PORT || 5001;
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    // Handle server errors
    server.on("error", (error) => {
      console.error("Server error:", error);
    });

    // Handle process termination
    process.on("SIGTERM", () => {
      console.log("Received SIGTERM. Shutting down gracefully...");
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    });

    process.on("SIGINT", () => {
      console.log("Received SIGINT. Shutting down gracefully...");
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
