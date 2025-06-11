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
    setExpenses((prevExpenses) =>
      prevExpenses.map((expense) =>
        expense === editingExpense ? updatedExpense : expense
      )
    );
    setEditingExpense(undefined);
  };

  const handleDeleteExpense = (expenseToDelete: ExpenseFormData) => {
    setExpenses((prevExpenses) =>
      prevExpenses.filter((expense) => expense !== expenseToDelete)
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
        />
      </Box>
    </Container>
  );
}
