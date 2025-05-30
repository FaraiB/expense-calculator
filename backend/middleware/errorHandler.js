// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Handle Sequelize validation errors
  if (err.name === "SequelizeValidationError") {
    const errors = err.errors.reduce((acc, error) => {
      const field = error.path;
      if (!acc[field]) {
        acc[field] = [];
      }
      acc[field].push(error.message);
      return acc;
    }, {});

    return res.status(400).json({
      message: "Validation error",
      errors: errors,
    });
  }

  // Handle Sequelize unique constraint errors
  if (err.name === "SequelizeUniqueConstraintError") {
    const errors = err.errors.reduce((acc, error) => {
      const field = error.path;
      if (!acc[field]) {
        acc[field] = [];
      }
      acc[field].push(`${field} must be unique`);
      return acc;
    }, {});

    return res.status(400).json({
      message: "Validation error",
      errors: errors,
    });
  }

  // Handle other Sequelize errors
  if (err.name === "SequelizeDatabaseError") {
    return res.status(400).json({
      message: "Database error",
      error: err.message,
    });
  }

  // Handle other types of errors
  return res.status(500).json({
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "An unexpected error occurred",
  });
};

module.exports = errorHandler;
