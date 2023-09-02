export type QuestionType = 'confirm' | 'list';

export interface BaseQuestion {
  type: QuestionType;
  name: string;
  message: string;
}

export interface ConfirmQuestion extends BaseQuestion {
  type: 'confirm';
  default?: boolean;
}

export interface ListQuestion extends BaseQuestion {
  type: 'list';
  choices: string[];
  default?: string;
}

export type Question = ConfirmQuestion | ListQuestion;
