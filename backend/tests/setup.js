const { sequelize } = require("../config/database");

// Set test environment
process.env.NODE_ENV = "test";

// Setup test database
beforeAll(async () => {
  // Use a separate test database
  const testDbPath = require("path").join(
    __dirname,
    "..",
    "test-database.sqlite"
  );
  sequelize.options.storage = testDbPath;

  // Sync the test database
  await sequelize.sync({ force: true });
});

// Clean up after each test
afterEach(async () => {
  // Clear all data from tables
  const models = sequelize.models;
  for (const modelName in models) {
    await models[modelName].destroy({ where: {}, force: true });
  }
});

// Close database connection after all tests
afterAll(async () => {
  await sequelize.close();
});
