const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const Expense = require("../models/Expense");
const {
  expenseValidationRules,
  validateExpense,
} = require("../middleware/expenseValidation");

// GET all expenses
router.get("/", async (req, res, next) => {
  try {
    const expenses = await Expense.findAll({
      order: [["date", "DESC"]],
    });
    res.json(expenses);
  } catch (error) {
    next(error);
  }
});

// GET expense by ID
router.get(
  "/:id",
  expenseValidationRules(),
  validateExpense,
  async (req, res, next) => {
    try {
      const expense = await Expense.findByPk(req.params.id);
      if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
      }
      res.json(expense);
    } catch (error) {
      next(error);
    }
  }
);

// GET expenses by month
router.get("/month/:year/:month", async (req, res, next) => {
  try {
    const { year, month } = req.params;
    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(year, month, 0); // Last day of the month

    const expenses = await Expense.findAll({
      where: {
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [["date", "DESC"]],
    });
    res.json(expenses);
  } catch (error) {
    next(error);
  }
});

// POST new expense
router.post(
  "/",
  expenseValidationRules(),
  validateExpense,
  async (req, res, next) => {
    try {
      const expense = await Expense.create(req.body);
      res.status(201).json(expense);
    } catch (error) {
      next(error);
    }
  }
);

// PUT update expense
router.put(
  "/:id",
  expenseValidationRules(),
  validateExpense,
  async (req, res, next) => {
    try {
      const expense = await Expense.findByPk(req.params.id);
      if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
      }
      await expense.update(req.body);
      res.json(expense);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE expense
router.delete(
  "/:id",
  expenseValidationRules(),
  validateExpense,
  async (req, res, next) => {
    try {
      const expense = await Expense.findByPk(req.params.id);
      if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
      }
      await expense.destroy();
      res.json({ message: "Expense deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
