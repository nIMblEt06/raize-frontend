import { CairoOption } from "starknet";

export interface Market {
  name: string;
  category: string;
  deadline: string;
  description: string;
  is_active: boolean;
  is_settled: boolean;
  outcomes: Outcome[];
  winning_outcome: CairoOption<Outcome>;
  money_in_pool: number;
  image: string;
  market_id: number;
}

export interface FPMMMarket {
  deadline: string;
  is_active: boolean;
  is_settled: boolean;
  num_outcomes: number;
}

export interface Outcome {
  name: string;
  bought_shares: string;
}

export interface FPMMOutcome {
  name: string;
  winner: boolean;
  num_shares_in_pool: number;
}

export interface UserPosition {
  amount: number;
  has_claimed: boolean;
}
export interface UserBet {
  outcome: Outcome;
  position: UserPosition;
}
