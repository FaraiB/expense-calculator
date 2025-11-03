import { useState } from "react";
import { Container, Box, Typography, Paper } from "@mui/material";
import { ExpenseForm } from "../components/ExpenseForm";
import type { ExpenseFormData } from "../components/ExpenseForm";
import { ExpenseList } from "../components/ExpenseList";

export function ExpenseDashboard() {
  const [expenses, setExpenses] = useState<ExpenseFormData[]>([]);
  const [editingExpense, setEditingExpense] = useState<
    ExpenseFormData | undefined
  >();

  const handleAddExpense = (newExpense: ExpenseFormData) => {
    setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
    setEditingExpense(undefined);
  };

  const handleEditExpense = (expenseToEdit: ExpenseFormData) => {
    setEditingExpense(expenseToEdit);
  };

  const handleUpdateExpense = (updatedExpense: ExpenseFormData) => {
    if (!editingExpense) return;

    setExpenses((prevExpenses) =>
      prevExpenses.map((expense) => {
        // Match by id if available, otherwise match by date (normalized to month/year)
        if (editingExpense.id && expense.id === editingExpense.id) {
          // Merge receipts: use new receipts if provided, otherwise keep existing ones
          const mergedReceipts = {
            ...(expense.receipts || {}),
            ...(updatedExpense.receipts || {}),
          };
          return {
            ...updatedExpense,
            id: expense.id,
            receipts: mergedReceipts,
          };
        }
        if (!editingExpense.id && !expense.id) {
          // Normalize dates to first day of month for comparison
          const editingDate = new Date(editingExpense.date);
          editingDate.setDate(1);
          editingDate.setHours(0, 0, 0, 0);
          const expenseDate = new Date(expense.date);
          expenseDate.setDate(1);
          expenseDate.setHours(0, 0, 0, 0);
          if (editingDate.getTime() === expenseDate.getTime()) {
            // Merge receipts: use new receipts if provided, otherwise keep existing ones
            const mergedReceipts = {
              ...(expense.receipts || {}),
              ...(updatedExpense.receipts || {}),
            };
            return {
              ...updatedExpense,
              receipts: mergedReceipts,
            };
          }
        }
        return expense;
      })
    );
    setEditingExpense(undefined);
  };

  const handleDeleteExpense = (expenseToDelete: ExpenseFormData) => {
    setExpenses((prevExpenses) =>
      prevExpenses.filter((expense) => expense !== expenseToDelete)
    );
  };

  const handleReceiptUpdate = (
    expense: ExpenseFormData,
    category: string,
    receipt: string | null
  ) => {
    setExpenses((prevExpenses) =>
      prevExpenses.map((exp) => {
        // Match expense by id or date
        const matchesById = expense.id && exp.id === expense.id;
        const matchesByDate =
          !expense.id &&
          !exp.id &&
          new Date(expense.date).getTime() === new Date(exp.date).getTime();

        if (matchesById || matchesByDate) {
          const updatedReceipts = { ...exp.receipts };
          if (receipt === null) {
            // Delete receipt
            delete updatedReceipts?.[category as keyof typeof updatedReceipts];
          } else {
            // Update or add receipt
            updatedReceipts[category as keyof typeof updatedReceipts] = receipt;
          }
          return {
            ...exp,
            receipts: updatedReceipts,
          };
        }
        return exp;
      })
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Expense Calculator
        </Typography>
      </Box>

      <Paper sx={{ p: 4, mb: 6 }}>
        <ExpenseForm
          onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}
          initialData={editingExpense}
        />
      </Paper>

      <Box sx={{ mt: 6 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Expense History
        </Typography>
        <ExpenseList
          expenses={expenses}
          onEdit={handleEditExpense}
          onDelete={handleDeleteExpense}
          onReceiptUpdate={handleReceiptUpdate}
        />
      </Box>
    </Container>
  );
}
