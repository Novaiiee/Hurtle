export interface User {
  id: string;
  username: string;
  email: string;
  accounts: Account[];
  sets: FlashCardSet[];
}

export type Provider = "github" | "google" | "local";

export interface Account {
  id: string;
  email: string;
  password?: string;
  provider: Provider;
  user: User;
}

export interface FlashCardSet {
  id: string;
  title: string;
  description?: string;
  cards: FlashCard[];
  creator: User;
  isPublic: boolean;
}

export interface FlashCard {
  id: string;
  question: string;
  answer: string;
  lastPracticedDate: Date;
  nextPracticedDate: Date;
  parentSet: FlashCardSet;
}

export type Errors<T extends string> = {
  [k in T]: string | null
}