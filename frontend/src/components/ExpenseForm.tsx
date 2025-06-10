import { useState } from "react";
import { Box, Button, TextField, Grid, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

export interface ExpenseFormData {
  date: Date;
  condominio: number;
  planoSaude: number;
  eletricidade: number;
  gas: number;
  internet: number;
  celular: number;
  creditCard: number;
  amountToPay: number;
}

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => void;
  initialData?: ExpenseFormData;
}

const formatAmount = (value: number): string => {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const EXPENSE_FIELDS = [
  { key: "condominio", label: "Condomínio" },
  { key: "planoSaude", label: "Plano de Saúde" },
  { key: "eletricidade", label: "Eletricidade" },
  { key: "gas", label: "Gás" },
  { key: "internet", label: "Internet" },
  { key: "celular", label: "Celular" },
  { key: "creditCard", label: "Cartão de Crédito" },
] as const;

export function ExpenseForm({ onSubmit, initialData }: ExpenseFormProps) {
  const [formData, setFormData] = useState<ExpenseFormData>(
    initialData || {
      date: new Date(),
      condominio: 0,
      planoSaude: 0,
      eletricidade: 0,
      gas: 0,
      internet: 0,
      celular: 0,
      creditCard: 0,
      amountToPay: 0,
    }
  );

  const [displayAmounts, setDisplayAmounts] = useState<Record<string, string>>(
    EXPENSE_FIELDS.reduce(
      (acc, field) => ({
        ...acc,
        [field.key]: initialData
          ? formatAmount(initialData[field.key])
          : "0,00",
      }),
      {}
    )
  );

  const [calculatedAmount, setCalculatedAmount] = useState<number | null>(null);

  // Calculate total for display
  const total = Object.values(formData)
    .filter(
      (value): value is number =>
        typeof value === "number" && value !== formData.amountToPay
    )
    .reduce((sum, value) => sum + value, 0);

  const handleAmountChange =
    (field: keyof ExpenseFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value.replace(/[^\d]/g, ""); // Remove non-digits

      if (input === "") {
        setDisplayAmounts((prev) => ({ ...prev, [field]: "0,00" }));
        setFormData((prev) => ({ ...prev, [field]: 0 }));
        return;
      }

      // Convert input to a number with 2 decimal places
      const numericValue = parseInt(input) / 100;
      const formattedValue = formatAmount(numericValue);

      setDisplayAmounts((prev) => ({ ...prev, [field]: formattedValue }));
      setFormData((prev) => ({ ...prev, [field]: numericValue }));
    };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    // Calculate total excluding condominio
    const totalExceptCondominio = EXPENSE_FIELDS.filter(
      (field) => field.key !== "condominio"
    ).reduce((sum, field) => sum + formData[field.key], 0);

    // Calculate amount to pay: (total except condominio / 2) - condominio
    const amountToPay = totalExceptCondominio / 2 - formData.condominio;

    setCalculatedAmount(amountToPay);
    setFormData((prev) => ({
      ...prev,
      amountToPay: amountToPay,
    }));

    onSubmit({
      ...formData,
      amountToPay: amountToPay,
    });
  };

  const handleClear = () => {
    const resetData = {
      date: new Date(),
      condominio: 0,
      planoSaude: 0,
      eletricidade: 0,
      gas: 0,
      internet: 0,
      celular: 0,
      creditCard: 0,
      amountToPay: 0,
    };

    const resetAmounts = EXPENSE_FIELDS.reduce(
      (acc, field) => ({
        ...acc,
        [field.key]: "0,00",
      }),
      {}
    );

    setFormData(resetData);
    setDisplayAmounts(resetAmounts);
    setCalculatedAmount(null);
  };

  return (
    <Box component="form" onSubmit={handleCalculate} sx={{ p: 3 }}>
      <Grid container spacing={3} columnSpacing={4}>
        <Grid item xs={12}>
          <DatePicker
            label="Month/Year"
            value={formData.date}
            onChange={(newDate) => {
              if (newDate) {
                const date = new Date(newDate);
                date.setDate(1);
                setFormData({ ...formData, date });
              }
            }}
            views={["month", "year"]}
            slotProps={{
              textField: {
                fullWidth: true,
                required: true,
              },
              layout: {
                sx: {
                  ".MuiPickersMonth-root": {
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  },
                  ".MuiPickersMonth-monthButton": {
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                  ".MuiPickersYear-yearButton": {
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                },
              },
            }}
          />
        </Grid>

        {EXPENSE_FIELDS.map((field) => (
          <Grid item xs={12} sm={6} key={field.key}>
            <TextField
              fullWidth
              label={field.label}
              value={displayAmounts[field.key]}
              onChange={handleAmountChange(field.key)}
              required
              inputProps={{
                inputMode: "numeric",
                style: { textAlign: "right" },
              }}
              InputProps={{
                startAdornment: <span>R$</span>,
              }}
            />
          </Grid>
        ))}

        <Grid item xs={12}>
          <Box sx={{ mt: 3, textAlign: "right" }}>
            <Typography variant="h6" component="div" gutterBottom>
              Total: R$ {formatAmount(total)}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
          >
            {initialData ? "Update Calculation" : "Calculate Expenses"}
          </Button>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Amount to Pay"
            value={
              calculatedAmount !== null ? formatAmount(calculatedAmount) : ""
            }
            InputProps={{
              startAdornment: <span>R$</span>,
              readOnly: true,
            }}
            inputProps={{
              style: { textAlign: "right" },
            }}
            disabled
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            type="button"
            variant="outlined"
            color="secondary"
            fullWidth
            size="large"
            onClick={handleClear}
          >
            Clear Form
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
