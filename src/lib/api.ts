export const api = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type Dashboard = {
  books: number;
  borrowers: number;
  activeLoans: number;
  lateLoans: number;
  availableBooks: number;
  borrowedBooks: number;
};

export type Book = {
  id: string;
  title: string;
  author: string | null;
  status: string | null;
  language?: string | null;
  location?: string | null;
  theme?: string | null;
};

export type Borrower = {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
};

export type Loan = {
  id: number;
  bookId: string;
  borrowerId: string;
  borrowedAt: string | null;
  dueAt: string | null;
  returnedAt: string | null;
  status: string | null;
  notes: string | null;
};

export type Overdue = Loan & { book: Book; borrower: Borrower };
export type DuplicatePayload = { duplicateTitles: number; duplicateCopies: number; books: Book[] };

export async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${api}${path}`, { cache: "no-store" });
  return res.json() as Promise<T>;
}
