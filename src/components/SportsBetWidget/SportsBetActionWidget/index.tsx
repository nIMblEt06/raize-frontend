import React from "react";
import "./styles.scss";
import { SportsBetActionCard } from "./SportsBetActionCard";
import CustomLogo from "@/components/common/CustomIcons";

interface Props {
  teams: { name: string; logo: string; price: number }[];
}

export const SportBetCard = ({ teams }: Props) => {
  return (
    <div className="SportsBetCard">
      <span className="TimeLabel">04 May 2025 | 11:00 PM</span>
      <span className="LeagueName">Serie B</span>
      <div className="TeamDetails">
        <div className="Team">
          <div className="TeamLogo">
            <CustomLogo src={teams[0].logo} />
          </div>
          <span className="TeamName">{teams[0].name}</span>
        </div>
        <span className="Label">Vs</span>
        <div className="Team">
          <div className="TeamLogo">
            <CustomLogo src={teams[1].logo} />
          </div>
          <span className="TeamName">{teams[1].name}</span>
        </div>
      </div>
      <div className="SportsBetActionContainer">
        <SportsBetActionCard name={teams[0].name} price={teams[0].price} />
        <SportsBetActionCard name={"Draw"} price={teams[0].price} />
        <SportsBetActionCard name={teams[1].name} price={teams[1].price} />
      </div>
    </div>
  );
};
