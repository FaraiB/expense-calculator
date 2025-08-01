import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock fetch for API calls
Object.defineProperty(window, "fetch", {
  value: vi.fn(),
  writable: true,
});

// Mock jsPDF
vi.mock("jspdf", () => ({
  default: vi.fn().mockImplementation(() => ({
    setFontSize: vi.fn(),
    text: vi.fn(),
    save: vi.fn(),
  })),
}));

// Mock jspdf-autotable
vi.mock("jspdf-autotable", () => ({
  default: vi.fn(),
}));
