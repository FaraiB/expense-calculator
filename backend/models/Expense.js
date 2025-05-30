const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

// Define the Expense model
const Expense = sequelize.define(
  "Expense",
  {
    // Primary key - automatically increments for each new expense
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // Date field - stores only month and year
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      get() {
        const date = this.getDataValue("date");
        if (date) {
          return date.toISOString().substring(0, 7);
        }
        return null;
      },
      set(value) {
        if (value) {
          if (typeof value === "string" && /^\d{4}-\d{2}$/.test(value)) {
            this.setDataValue("date", new Date(`${value}-01`));
          } else {
            const date = new Date(value);
            date.setDate(1);
            this.setDataValue("date", date);
          }
        }
      },
      validate: {
        isDate: true,
        notNull: {
          msg: "Date is required (YYYY-MM format)",
        },
      },
    },

    // Condominio expense
    condominio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        isDecimal: true,
        min: 0,
      },
    },

    // Health Insurance (Plano de Saude)
    planoSaude: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        isDecimal: true,
        min: 0,
      },
    },

    // Electricity bill
    eletricidade: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        isDecimal: true,
        min: 0,
      },
    },

    // Gas bill
    gas: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        isDecimal: true,
        min: 0,
      },
    },

    // Internet bill
    internet: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        isDecimal: true,
        min: 0,
      },
    },

    // Mobile phone bill
    celular: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        isDecimal: true,
        min: 0,
      },
    },

    // Credit Card bill
    creditCard: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        isDecimal: true,
        min: 0,
      },
    },

    // Calculated and stored total
    calculatedTotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        isDecimal: true,
        min: 0,
      },
    },

    // Amount to be paid
    amountToPay: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        isDecimal: true,
        min: 0,
      },
    },

    // Virtual total for calculations
    total: {
      type: DataTypes.VIRTUAL,
      get() {
        return [
          this.condominio,
          this.planoSaude,
          this.eletricidade,
          this.gas,
          this.internet,
          this.celular,
          this.creditCard,
        ].reduce((sum, value) => sum + Number(value), 0);
      },
    },
  },
  {
    tableName: "expenses",
    timestamps: true,
    hooks: {
      // Before saving or updating, calculate and store the total
      beforeSave: (expense) => {
        expense.calculatedTotal = expense.total;
        // Set amountToPay to match calculatedTotal if it's still at default value
        if (expense.amountToPay === 0) {
          expense.amountToPay = expense.calculatedTotal;
        }
      },
    },
  }
);

// Export the model
module.exports = Expense;
