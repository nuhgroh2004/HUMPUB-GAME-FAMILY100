
export interface QuestionCell {
  id: string;
  question: string;
  answer: string;
  isOpened: boolean;
}

export interface Category {
  id: string;
  name: string;
  questions: QuestionCell[];
}

export interface Team {
  id: string;
  name: string;
  score: number;
}

export interface GameState {
  categories: Category[];
  teams: Team[];
}
