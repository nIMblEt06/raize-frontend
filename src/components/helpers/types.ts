export interface Market {
  name: string;
  betToken: string;
  category: string;
  deadline: string;
  description: string;
  isActive: boolean;
  isSettled: boolean;
  outcomes: Outcome[];
  winningOutcome: Outcome | null;
  moneyInPool: number;
  image: string;
}

export interface Outcome {
  name: string;
  currentOdds: string;
  boughtShares: string;
}
