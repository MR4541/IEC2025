import { Dispatch, SetStateAction } from "react";

export type Setter<T> = Dispatch<SetStateAction<T>>;

export interface Context<T> {
  value: T;
  setValue: Setter<T>;
}

export interface IncomeStatement {
  revenue: number;
  cost: number;
  expense: number;
  otherIncome: number;
  tax: number;
}

