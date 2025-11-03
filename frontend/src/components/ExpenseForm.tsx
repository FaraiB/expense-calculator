import { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Grid,
  Typography,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
} from "@mui/material";
import {
  AttachFile as AttachFileIcon,
  Close as CloseIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";

export interface ExpenseFormData {
  id?: number;
  date: Date;
  condominio: number;
  planoSaude: number;
  eletricidade: number;
  gas: number;
  internet: number;
  celular: number;
  creditCard: number;
  amountToPay: number;
  receipts?: {
    condominio?: string; // base64 data URL (image or PDF)
    planoSaude?: string;
    eletricidade?: string;
    gas?: string;
    internet?: string;
    celular?: string;
    creditCard?: string;
  };
}

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => void;
  initialData?: ExpenseFormData;
  loading?: boolean;
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

export function ExpenseForm({
  onSubmit,
  initialData,
  loading,
}: ExpenseFormProps) {
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
      receipts: {},
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
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Update form data when initialData changes (when editing)
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setDisplayAmounts(
        EXPENSE_FIELDS.reduce(
          (acc, field) => ({
            ...acc,
            [field.key]: formatAmount(initialData[field.key]),
          }),
          {}
        )
      );
      setCalculatedAmount(initialData.amountToPay);
    } else {
      // Reset form when not editing
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
        receipts: {},
      };
      setFormData(resetData);
      setDisplayAmounts(
        EXPENSE_FIELDS.reduce(
          (acc, field) => ({
            ...acc,
            [field.key]: "0,00",
          }),
          {}
        )
      );
      setCalculatedAmount(null);
      // Reset file inputs
      Object.keys(fileInputRefs.current).forEach((key) => {
        if (fileInputRefs.current[key]) {
          fileInputRefs.current[key]!.value = "";
        }
      });
    }
  }, [initialData]);

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
      receipts: formData.receipts || {},
    });
  };

  const handleFileUpload = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type (images or PDFs)
    const isImage = file.type.startsWith("image/");
    const isPDF = file.type === "application/pdf";
    
    if (!isImage && !isPDF) {
      alert("Please upload an image file (JPG, PNG, etc.) or PDF");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData((prev) => ({
        ...prev,
        receipts: {
          ...prev.receipts,
          [field]: base64String,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveReceipt = (field: string) => () => {
    setFormData((prev) => {
      const newReceipts = { ...prev.receipts };
      delete newReceipts?.[field as keyof typeof newReceipts];
      return {
        ...prev,
        receipts: newReceipts,
      };
    });
    // Reset file input
    if (fileInputRefs.current[field]) {
      fileInputRefs.current[field]!.value = "";
    }
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
      receipts: {},
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
    // Reset all file inputs
    Object.keys(fileInputRefs.current).forEach((key) => {
      if (fileInputRefs.current[key]) {
        fileInputRefs.current[key]!.value = "";
      }
    });
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
            <Box>
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
              <Box sx={{ mt: 1 }}>
                <input
                  accept="image/*,application/pdf"
                  style={{ display: "none" }}
                  id={`receipt-upload-${field.key}`}
                  type="file"
                  onChange={handleFileUpload(field.key)}
                  ref={(el) => {
                    fileInputRefs.current[field.key] = el;
                  }}
                />
                <Stack direction="row" spacing={1} alignItems="center">
                  <label htmlFor={`receipt-upload-${field.key}`}>
                    <Button
                      component="span"
                      size="small"
                      variant="outlined"
                      startIcon={<AttachFileIcon />}
                      sx={{ fontSize: "0.75rem" }}
                    >
                      Upload Receipt
                    </Button>
                  </label>
                  {formData.receipts?.[field.key as keyof typeof formData.receipts] && (
                    <Paper
                      elevation={1}
                      sx={{
                        p: 0.5,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        flex: 1,
                      }}
                    >
                      <ImageIcon sx={{ fontSize: 16, color: "success.main" }} />
                      <Typography variant="caption" sx={{ flex: 1 }}>
                        Receipt uploaded
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={handleRemoveReceipt(field.key)}
                        sx={{ p: 0.25 }}
                      >
                        <CloseIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Paper>
                  )}
                </Stack>
              </Box>
            </Box>
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
            disabled={loading}
            startIcon={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : undefined
            }
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
