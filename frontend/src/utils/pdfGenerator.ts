import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import type { ExpenseFormData } from "../components/ExpenseForm";

const formatAmount = (value: number): string => {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const generateExpensePDF = (
  expenses: ExpenseFormData[],
  title: string = "Monthly Expense Report"
) => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(20);
  doc.text(title, 14, 22);

  // Add date
  doc.setFontSize(12);
  doc.text(`Generated on: ${format(new Date(), "dd/MM/yyyy HH:mm")}`, 14, 32);

  // Prepare table data
  const tableData = expenses.map((expense) => {
    const total = [
      expense.condominio,
      expense.planoSaude,
      expense.eletricidade,
      expense.gas,
      expense.internet,
      expense.celular,
      expense.creditCard,
    ].reduce((sum, value) => sum + value, 0);

    return [
      format(expense.date, "MMM yyyy"),
      `R$ ${formatAmount(expense.condominio)}`,
      `R$ ${formatAmount(expense.planoSaude)}`,
      `R$ ${formatAmount(expense.eletricidade)}`,
      `R$ ${formatAmount(expense.gas)}`,
      `R$ ${formatAmount(expense.internet)}`,
      `R$ ${formatAmount(expense.celular)}`,
      `R$ ${formatAmount(expense.creditCard)}`,
      `R$ ${formatAmount(total)}`,
      `R$ ${formatAmount(expense.amountToPay)}`,
    ];
  });

  // Add table
  autoTable(doc, {
    head: [
      [
        "Date",
        "Condomínio",
        "Plano de Saúde",
        "Eletricidade",
        "Gás",
        "Internet",
        "Celular",
        "Cartão de Crédito",
        "Total",
        "Amount to Pay",
      ],
    ],
    body: tableData,
    startY: 40,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 18 },
      2: { cellWidth: 18 },
      3: { cellWidth: 18 },
      4: { cellWidth: 15 },
      5: { cellWidth: 15 },
      6: { cellWidth: 15 },
      7: { cellWidth: 18 },
      8: { cellWidth: 18 },
      9: { cellWidth: 18 },
    },
  });

  // Add summary
  const finalY = (doc as any).lastAutoTable.finalY || 40;
  doc.setFontSize(12);
  doc.text(`Total Records: ${expenses.length}`, 14, finalY + 20);

  // Calculate totals
  const grandTotal = expenses.reduce((sum, expense) => {
    const total = [
      expense.condominio,
      expense.planoSaude,
      expense.eletricidade,
      expense.gas,
      expense.internet,
      expense.celular,
      expense.creditCard,
    ].reduce((sum, value) => sum + value, 0);
    return sum + total;
  }, 0);

  const totalAmountToPay = expenses.reduce(
    (sum, expense) => sum + expense.amountToPay,
    0
  );

  doc.text(`Grand Total: R$ ${formatAmount(grandTotal)}`, 14, finalY + 30);
  doc.text(
    `Total Amount to Pay: R$ ${formatAmount(totalAmountToPay)}`,
    14,
    finalY + 40
  );

  // Save the PDF
  const fileName = `expense-report-${format(
    new Date(),
    "yyyy-MM-dd-HH-mm"
  )}.pdf`;
  doc.save(fileName);
};

export const generateSingleExpensePDF = (expense: ExpenseFormData) => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(20);
  doc.text("Monthly Expense Details", 14, 22);

  // Add date
  doc.setFontSize(12);
  doc.text(`Month: ${format(expense.date, "MMMM yyyy")}`, 14, 32);
  doc.text(`Generated on: ${format(new Date(), "dd/MM/yyyy HH:mm")}`, 14, 42);

  // Calculate total
  const total = [
    expense.condominio,
    expense.planoSaude,
    expense.eletricidade,
    expense.gas,
    expense.internet,
    expense.celular,
    expense.creditCard,
  ].reduce((sum, value) => sum + value, 0);

  // Add expense details
  const details = [
    ["Condomínio", `R$ ${formatAmount(expense.condominio)}`],
    ["Plano de Saúde", `R$ ${formatAmount(expense.planoSaude)}`],
    ["Eletricidade", `R$ ${formatAmount(expense.eletricidade)}`],
    ["Gás", `R$ ${formatAmount(expense.gas)}`],
    ["Internet", `R$ ${formatAmount(expense.internet)}`],
    ["Celular", `R$ ${formatAmount(expense.celular)}`],
    ["Cartão de Crédito", `R$ ${formatAmount(expense.creditCard)}`],
    ["", ""],
    ["Total", `R$ ${formatAmount(total)}`],
    ["Amount to Pay", `R$ ${formatAmount(expense.amountToPay)}`],
  ];

  autoTable(doc, {
    head: [["Expense Category", "Amount"]],
    body: details,
    startY: 50,
    styles: {
      fontSize: 10,
      cellPadding: 4,
    },
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255,
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 60 },
    },
  });

  // Save the PDF
  const fileName = `expense-${format(expense.date, "yyyy-MM")}.pdf`;
  doc.save(fileName);
};
