import axios from "axios";
import type { Expense, ExpenseFormData } from "../types/expense";

const API_BASE_URL = "http://localhost:5001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const expenseService = {
  // Get all expenses
  getAllExpenses: async () => {
    const response = await api.get<Expense[]>("/expenses");
    return response.data;
  },

  // Get expense by ID
  getExpenseById: async (id: number) => {
    const response = await api.get<Expense>(`/expenses/${id}`);
    return response.data;
  },

  // Get expenses by month/year
  getExpensesByMonth: async (date: string) => {
    const response = await api.get<Expense[]>(`/expenses/month/${date}`);
    return response.data;
  },

  // Create new expense
  createExpense: async (expenseData: ExpenseFormData) => {
    const response = await api.post<Expense>("/expenses", expenseData);
    return response.data;
  },

  // Update expense
  updateExpense: async (id: number, expenseData: ExpenseFormData) => {
    const response = await api.put<Expense>(`/expenses/${id}`, expenseData);
    return response.data;
  },

  // Delete expense
  deleteExpense: async (id: number) => {
    await api.delete(`/expenses/${id}`);
  },
};
