import { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  Container,
  Paper,
  Typography,
  Box,
  Alert,
  Snackbar,
} from "@mui/material";
import { ExpenseForm, type ExpenseFormData } from "./components/ExpenseForm";
import { ExpenseList } from "./components/ExpenseList";

// Create a theme instance
const theme = createTheme({
  palette: {
    mode: "light",
  },
});

const API_BASE_URL = "http://localhost:5001/api/expenses";

export default function App() {
  const [expenses, setExpenses] = useState<ExpenseFormData[]>([]);
  const [editingExpense, setEditingExpense] = useState<ExpenseFormData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load expenses from API on component mount
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch expenses: ${response.status} ${response.statusText}`
        );
      }
      const data = await response.json();

      // Transform the data to match frontend expectations
      const transformedData = data.map((expense: any) => ({
        ...expense,
        date: new Date(expense.date + "-01"), // Convert YYYY-MM to Date object
      }));

      setExpenses(transformedData);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (expense: ExpenseFormData) => {
    try {
      setLoading(true);
      const expenseData = {
        ...expense,
        date: expense.date.toISOString().substring(0, 7), // Format as YYYY-MM
      };

      if (editingExpense) {
        // Update existing expense
        const response = await fetch(`${API_BASE_URL}/${editingExpense.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(expenseData),
        });

        if (!response.ok) {
          throw new Error("Failed to update expense");
        }

        setSuccess("Expense updated successfully");
        setEditingExpense(null);
      } else {
        // Add new expense
        const response = await fetch(API_BASE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(expenseData),
        });

        if (!response.ok) {
          throw new Error("Failed to create expense");
        }

        setSuccess("Expense created successfully");
      }

      // Refresh the expenses list
      await fetchExpenses();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save expense");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (expense: ExpenseFormData) => {
    setEditingExpense(expense);
  };

  const handleDelete = async (expense: ExpenseFormData) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${expense.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete expense");
      }

      setSuccess("Expense deleted successfully");
      await fetchExpenses();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete expense");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Monthly Expense Calculator
          </Typography>

          {error && (
            <Box sx={{ mb: 2 }}>
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            </Box>
          )}

          <Box sx={{ mb: 4 }}>
            <Paper sx={{ p: 3 }}>
              <ExpenseForm
                onSubmit={handleSubmit}
                initialData={editingExpense || undefined}
                loading={loading}
              />
            </Paper>
          </Box>

          <ExpenseList
            expenses={expenses}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />

          <Snackbar
            open={!!success}
            autoHideDuration={6000}
            onClose={handleCloseAlert}
          >
            <Alert onClose={handleCloseAlert} severity="success">
              {success}
            </Alert>
          </Snackbar>
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
