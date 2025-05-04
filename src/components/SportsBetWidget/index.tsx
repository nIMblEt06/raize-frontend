import React from "react";
import "./styles.scss";
import { LeagueCard } from "./LeagueCard";
import { SportBetCard } from "./SportsBetActionWidget";

const sportsEmojis = [
  "⚽️", // football (soccer)
  "🏀", // basketball
  "🎾", // tennis
  "🏏", // cricket
  "🏉", // rugby
  "🥊", // boxing
];

export const SportsBetWidget = () => {
  return (
    <div className="SportsBetContainer">
      <span className="Heading">Future of Sports Betting</span>
      <div className="SportsTypeContainer">
        {sportsEmojis.map((el, index) => (
          <div className="SportsType" key={index}>
            {el}
          </div>
        ))}
      </div>
      <div className="SportsBetSection">
        <div className="SportsBetLeaguesContainer">
          <div className="LeagueContainer">
            <LeagueCard />
          </div>
        </div>
        <div className="SportsBetCardsContainer">
          <SportBetCard />
        </div>
      </div>
    </div>
  );
};
