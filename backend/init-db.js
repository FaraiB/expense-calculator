const { sequelize } = require("./config/database");
const Expense = require("./models/Expense");

async function initializeDatabase() {
  try {
    // Sync database (this will create tables if they don't exist)
    await sequelize.sync({ force: true }); // Be careful with force: true in production!
    console.log("Database synchronized successfully");

    // Create some test data
    const testExpenses = [
      {
        date: new Date("2024-03-01"),
        condominio: 500.0,
        planoSaude: 300.0,
        eletricidade: 150.0,
        gas: 50.0,
        internet: 100.0,
        celular: 80.0,
        creditCard: 1200.0,
      },
      {
        date: new Date("2024-02-01"),
        condominio: 500.0,
        planoSaude: 300.0,
        eletricidade: 180.0,
        gas: 45.0,
        internet: 100.0,
        celular: 80.0,
        creditCard: 950.0,
      },
    ];

    // Insert test data
    await Expense.bulkCreate(testExpenses);
    console.log("Test data inserted successfully");

    console.log("Database initialization completed");
  } catch (error) {
    console.error("Error initializing database:", error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
}

// Run the initialization
initializeDatabase();
