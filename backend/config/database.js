const { Sequelize } = require("sequelize");
const path = require("path");

// Create SQLite database connection
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "..", "database.sqlite"), // Store in backend root
  logging: console.log, // Enable SQL query logging
});

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

// Create tables if they don't exist
const syncDatabase = async () => {
  try {
    await sequelize.sync();
    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing database:", error);
  }
};

module.exports = {
  sequelize,
  testConnection,
  syncDatabase,
};
