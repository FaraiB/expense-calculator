import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Container, Paper, Typography, Box } from "@mui/material";
import { ExpenseForm, type ExpenseFormData } from "./components/ExpenseForm";
import { ExpenseList } from "./components/ExpenseList";

// Create a theme instance
const theme = createTheme({
  palette: {
    mode: "light",
  },
});

export default function App() {
  const [expenses, setExpenses] = useState<ExpenseFormData[]>([]);
  const [editingExpense, setEditingExpense] = useState<ExpenseFormData | null>(
    null
  );

  const handleSubmit = (expense: ExpenseFormData) => {
    if (editingExpense) {
      // Update existing expense
      setExpenses(expenses.map((e) => (e === editingExpense ? expense : e)));
      setEditingExpense(null);
    } else {
      // Add new expense
      setExpenses([...expenses, expense]);
    }
  };

  const handleEdit = (expense: ExpenseFormData) => {
    setEditingExpense(expense);
  };

  const handleDelete = (expense: ExpenseFormData) => {
    setExpenses(expenses.filter((e) => e !== expense));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Monthly Expense Calculator
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Paper sx={{ p: 3 }}>
              <ExpenseForm
                onSubmit={handleSubmit}
                initialData={editingExpense || undefined}
              />
            </Paper>
          </Box>

          <ExpenseList
            expenses={expenses}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
