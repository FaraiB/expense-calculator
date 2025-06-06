export interface Expense {
  id?: number;
  date: string; // YYYY-MM format
  condominio: number;
  planoSaude: number;
  eletricidade: number;
  gas: number;
  internet: number;
  celular: number;
  creditCard: number;
  calculatedTotal: number;
  amountToPay: number;
  createdAt?: string;
  updatedAt?: string;
}

export type ExpenseFormData = Omit<
  Expense,
  "calculatedTotal" | "id" | "createdAt" | "updatedAt"
>;

export type ExpenseCategory =
  | "condominio"
  | "planoSaude"
  | "eletricidade"
  | "gas"
  | "internet"
  | "celular"
  | "creditCard";
