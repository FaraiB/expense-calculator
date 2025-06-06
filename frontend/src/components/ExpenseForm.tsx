import { useState, useEffect } from "react";
import { TextField, Button, Typography, Paper, Grid } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import type { Expense, ExpenseFormData } from "../types/expense";
import { format, parse } from "date-fns";

interface ExpenseFormProps {
  initialData?: Expense;
  onSubmit: (data: ExpenseFormData) => void;
  isLoading?: boolean;
}

const INITIAL_FORM_STATE: ExpenseFormData = {
  date: format(new Date(), "yyyy-MM"),
  condominio: 0,
  planoSaude: 0,
  eletricidade: 0,
  gas: 0,
  internet: 0,
  celular: 0,
  creditCard: 0,
  amountToPay: 0,
};

export const ExpenseForm = ({
  initialData,
  onSubmit,
  isLoading = false,
}: ExpenseFormProps) => {
  const [formData, setFormData] = useState<ExpenseFormData>(
    initialData || INITIAL_FORM_STATE
  );

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange =
    (field: keyof ExpenseFormData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: field === "date" ? value : Number(value),
      }));
    };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        date: format(date, "yyyy-MM"),
      }));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              {initialData ? "Edit Expense" : "New Expense"}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <DatePicker
              label="Month/Year"
              value={parse(formData.date, "yyyy-MM", new Date())}
              onChange={handleDateChange}
              views={["year", "month"]}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Condomínio"
              type="number"
              value={formData.condominio}
              onChange={handleInputChange("condominio")}
              required
              inputProps={{ step: "0.01" }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Plano de Saúde"
              type="number"
              value={formData.planoSaude}
              onChange={handleInputChange("planoSaude")}
              required
              inputProps={{ step: "0.01" }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Eletricidade"
              type="number"
              value={formData.eletricidade}
              onChange={handleInputChange("eletricidade")}
              required
              inputProps={{ step: "0.01" }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Gás"
              type="number"
              value={formData.gas}
              onChange={handleInputChange("gas")}
              required
              inputProps={{ step: "0.01" }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Internet"
              type="number"
              value={formData.internet}
              onChange={handleInputChange("internet")}
              required
              inputProps={{ step: "0.01" }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Celular"
              type="number"
              value={formData.celular}
              onChange={handleInputChange("celular")}
              required
              inputProps={{ step: "0.01" }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Credit Card"
              type="number"
              value={formData.creditCard}
              onChange={handleInputChange("creditCard")}
              required
              inputProps={{ step: "0.01" }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Amount to Pay"
              type="number"
              value={formData.amountToPay}
              onChange={handleInputChange("amountToPay")}
              required
              inputProps={{ step: "0.01" }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isLoading}
            >
              {isLoading
                ? "Saving..."
                : initialData
                ? "Update Expense"
                : "Create Expense"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};
