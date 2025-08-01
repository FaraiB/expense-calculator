import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  Button,
  Stack,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import type { ExpenseFormData } from "./ExpenseForm";
import {
  generateExpensePDF,
  generateSingleExpensePDF,
} from "../utils/pdfGenerator";

interface ExpenseListProps {
  expenses: ExpenseFormData[];
  onEdit: (expense: ExpenseFormData) => void;
  onDelete: (expense: ExpenseFormData) => void;
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

export function ExpenseList({
  expenses,
  onEdit,
  onDelete,
  loading,
}: ExpenseListProps) {
  const handleDownloadAll = () => {
    generateExpensePDF(expenses);
  };

  const handleDownloadSingle = (expense: ExpenseFormData) => {
    generateSingleExpensePDF(expense);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (expenses.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 3 }}>
        <Typography variant="body1" color="text.secondary">
          No calculations yet. Use the form above to calculate your expenses.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
          startIcon={<PdfIcon />}
          onClick={handleDownloadAll}
          disabled={expenses.length === 0}
        >
          Download All as PDF
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              {EXPENSE_FIELDS.map((field) => (
                <TableCell key={field.key} align="right">
                  {field.label}
                </TableCell>
              ))}
              <TableCell align="right">Total</TableCell>
              <TableCell align="right">Amount to Pay</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense, index) => {
              const total = EXPENSE_FIELDS.reduce(
                (sum, field) => sum + expense[field.key],
                0
              );

              return (
                <TableRow key={expense.id || index}>
                  <TableCell>{format(expense.date, "MMM yyyy")}</TableCell>
                  {EXPENSE_FIELDS.map((field) => (
                    <TableCell key={field.key} align="right">
                      R$ {formatAmount(expense[field.key])}
                    </TableCell>
                  ))}
                  <TableCell align="right">
                    <strong>R$ {formatAmount(total)}</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>
                      R$ {formatAmount(expense.amountToPay || total)}
                    </strong>
                  </TableCell>
                  <TableCell align="right">
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="flex-end"
                    >
                      <IconButton
                        size="small"
                        onClick={() => onEdit(expense)}
                        aria-label="edit"
                        disabled={loading}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDownloadSingle(expense)}
                        aria-label="download"
                        disabled={loading}
                      >
                        <DownloadIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => onDelete(expense)}
                        aria-label="delete"
                        disabled={loading}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
