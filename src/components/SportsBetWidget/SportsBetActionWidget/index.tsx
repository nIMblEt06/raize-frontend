import React from "react";
import "./styles.scss";
import { SportsBetActionCard } from "./SportsBetActionCard";

export const SportBetCard = () => {
  return (
    <div className="SportsBetCard">
      <span className="TimeLabel">04 May 2025 | 11:00 PM</span>
      <span className="LeagueName">Serie B</span>
      <div className="TeamDetails">
        <div className="Team">
          <div className="TeamLogo"></div>
          <span className="TeamName">US Cremonese</span>
        </div>
        <span className="Label">Vs</span>
        <div className="Team">
          <div className="TeamLogo"></div>
          <span className="TeamName">US Cremonese</span>
        </div>
      </div>
      <div className="SportsBetActionContainer">
        <SportsBetActionCard />
        <SportsBetActionCard />
        <SportsBetActionCard />
      </div>
    </div>
  );
};
