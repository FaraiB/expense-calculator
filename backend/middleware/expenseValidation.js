const { body, param, validationResult } = require("express-validator");

// Validation rules for expense fields
const expenseValidationRules = () => {
  return [
    // Date validation
    body("date")
      .notEmpty()
      .withMessage("Date is required")
      .matches(/^\d{4}-\d{2}$/)
      .withMessage("Date must be in YYYY-MM format")
      .custom((value) => {
        const [year, month] = value.split("-");
        const date = new Date(year, month - 1);
        return (
          date.getFullYear() === parseInt(year) &&
          date.getMonth() + 1 === parseInt(month)
        );
      })
      .withMessage("Invalid date"),

    // Numeric field validations
    body([
      "condominio",
      "planoSaude",
      "eletricidade",
      "gas",
      "internet",
      "celular",
      "creditCard",
    ])
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Must be a non-negative number")
      .isFloat({ max: 999999.99 })
      .withMessage("Value exceeds maximum allowed (999,999.99)")
      .custom((value) => {
        const str = value.toString();
        const decimals = str.includes(".") ? str.split(".")[1].length : 0;
        return decimals <= 2;
      })
      .withMessage("Maximum 2 decimal places allowed"),

    // ID parameter validation for routes that use it
    param("id")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Invalid ID parameter"),
  ];
};

// Validation rules for ID-only operations (GET, DELETE)
const idValidationRules = () => {
  return [param("id").isInt({ min: 1 }).withMessage("Invalid ID parameter")];
};

// Middleware to handle validation errors
const validateExpense = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Format errors in a more user-friendly way
    const formattedErrors = errors.array().reduce((acc, error) => {
      const field = error.path;
      if (!acc[field]) {
        acc[field] = [];
      }
      acc[field].push(error.msg);
      return acc;
    }, {});

    return res.status(400).json({
      message: "Validation error",
      errors: formattedErrors,
    });
  }
  next();
};

module.exports = {
  expenseValidationRules,
  idValidationRules,
  validateExpense,
};
