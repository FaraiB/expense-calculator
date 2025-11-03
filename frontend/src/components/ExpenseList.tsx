import { useState, useRef } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  Receipt as ReceiptIcon,
  Close as CloseIcon,
  DeleteOutline as DeleteOutlineIcon,
  CloudUpload as CloudUploadIcon,
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
  onReceiptUpdate?: (
    expense: ExpenseFormData,
    category: string,
    receipt: string | null
  ) => void;
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
  onReceiptUpdate,
  loading,
}: ExpenseListProps) {
  const [previewReceipt, setPreviewReceipt] = useState<{
    open: boolean;
    fileUrl: string;
    category: string;
    categoryKey: string;
    fileType: "image" | "pdf";
    expense: ExpenseFormData | null;
  }>({
    open: false,
    fileUrl: "",
    category: "",
    categoryKey: "",
    fileType: "image",
    expense: null,
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDownloadAll = () => {
    generateExpensePDF(expenses);
  };

  const handleDownloadSingle = (expense: ExpenseFormData) => {
    generateSingleExpensePDF(expense);
  };

  const handlePreviewReceipt = (
    fileUrl: string,
    category: string,
    categoryKey: string,
    expense: ExpenseFormData
  ) => {
    // Detect file type from data URL
    const isPDF =
      fileUrl.startsWith("data:application/pdf") ||
      fileUrl.includes("application/pdf");
    setPreviewReceipt({
      open: true,
      fileUrl,
      category,
      categoryKey,
      fileType: isPDF ? "pdf" : "image",
      expense,
    });
  };

  const handleClosePreview = () => {
    setPreviewReceipt({
      open: false,
      fileUrl: "",
      category: "",
      categoryKey: "",
      fileType: "image",
      expense: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownloadReceipt = () => {
    if (
      !previewReceipt.fileUrl ||
      !previewReceipt.category ||
      !previewReceipt.expense
    )
      return;

    const link = document.createElement("a");
    link.href = previewReceipt.fileUrl;

    // Determine file extension
    const isPDF = previewReceipt.fileType === "pdf";
    const extension = isPDF ? "pdf" : "png";
    const fileName = `${
      previewReceipt.expense.date.toISOString().split("T")[0]
    }_${previewReceipt.categoryKey}_receipt.${extension}`;

    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteReceipt = () => {
    if (
      !previewReceipt.expense ||
      !previewReceipt.categoryKey ||
      !onReceiptUpdate
    )
      return;

    if (
      window.confirm(
        `Are you sure you want to delete the receipt for ${previewReceipt.category}?`
      )
    ) {
      onReceiptUpdate(previewReceipt.expense, previewReceipt.categoryKey, null);
      handleClosePreview();
    }
  };

  const handleUploadNewReceipt = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (
      !file ||
      !previewReceipt.expense ||
      !previewReceipt.categoryKey ||
      !onReceiptUpdate
    )
      return;

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
      onReceiptUpdate(
        previewReceipt.expense!,
        previewReceipt.categoryKey,
        base64String
      );

      // Update preview with new receipt
      const isPDFFile = file.type === "application/pdf";
      setPreviewReceipt((prev) => ({
        ...prev,
        fileUrl: base64String,
        fileType: isPDFFile ? "pdf" : "image",
      }));
    };
    reader.readAsDataURL(file);
  };

  const getReceiptIcon = (expense: ExpenseFormData, fieldKey: string) => {
    const receiptUrl =
      expense.receipts?.[fieldKey as keyof typeof expense.receipts];
    if (!receiptUrl) return null;

    const fieldLabel =
      EXPENSE_FIELDS.find((f) => f.key === fieldKey)?.label || fieldKey;
    return (
      <Tooltip title={`View ${fieldLabel} receipt`}>
        <IconButton
          size="small"
          onClick={() =>
            handlePreviewReceipt(receiptUrl, fieldLabel, fieldKey, expense)
          }
          sx={{ p: 0.5 }}
        >
          <ReceiptIcon sx={{ fontSize: 16, color: "success.main" }} />
        </IconButton>
      </Tooltip>
    );
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
        <Tooltip title="Download all expenses as a PDF document">
          <span>
            <Button
              variant="outlined"
              startIcon={<PdfIcon />}
              onClick={handleDownloadAll}
              disabled={expenses.length === 0}
            >
              Download All as PDF
            </Button>
          </span>
        </Tooltip>
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
                      <Stack
                        direction="row"
                        spacing={0.5}
                        alignItems="center"
                        justifyContent="flex-end"
                      >
                        <span>R$ {formatAmount(expense[field.key])}</span>
                        {getReceiptIcon(expense, field.key)}
                      </Stack>
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
                      <Tooltip title="Edit">
                        <span>
                          <IconButton
                            size="small"
                            onClick={() => onEdit(expense)}
                            aria-label="edit"
                            disabled={loading}
                          >
                            <EditIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Download PDF">
                        <span>
                          <IconButton
                            size="small"
                            onClick={() => handleDownloadSingle(expense)}
                            aria-label="download"
                            disabled={loading}
                          >
                            <DownloadIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <span>
                          <IconButton
                            size="small"
                            onClick={() => onDelete(expense)}
                            aria-label="delete"
                            disabled={loading}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={previewReceipt.open}
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">
              Receipt: {previewReceipt.category}
            </Typography>
            <IconButton onClick={handleClosePreview} size="small">
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 400,
              width: "100%",
            }}
          >
            {previewReceipt.fileType === "pdf" ? (
              <iframe
                src={previewReceipt.fileUrl}
                style={{
                  width: "100%",
                  height: "70vh",
                  border: "none",
                }}
                title={`Receipt for ${previewReceipt.category}`}
              />
            ) : (
              <img
                src={previewReceipt.fileUrl}
                alt={`Receipt for ${previewReceipt.category}`}
                style={{
                  maxWidth: "100%",
                  maxHeight: "70vh",
                  objectFit: "contain",
                }}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <input
            accept="image/*,application/pdf"
            style={{ display: "none" }}
            id="receipt-upload-modal"
            type="file"
            onChange={handleUploadNewReceipt}
            ref={fileInputRef}
          />
          <label htmlFor="receipt-upload-modal">
            <Button
              component="span"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              disabled={!onReceiptUpdate}
            >
              Upload New
            </Button>
          </label>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadReceipt}
          >
            Download
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteOutlineIcon />}
            onClick={handleDeleteReceipt}
            disabled={!onReceiptUpdate}
          >
            Delete
          </Button>
          <Button onClick={handleClosePreview}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
