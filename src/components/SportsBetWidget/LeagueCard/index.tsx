import React from "react";
import "./styles.scss";
import CustomLogo from "@/components/common/CustomIcons";

interface Props {
  logo: string;
  name: string;
}

export const LeagueCard = ({ logo, name }: Props) => {
  return (
    <div className="League">
      <div className="LeagueImage">
        <CustomLogo src={logo} />
      </div>
      <span>{name}</span>
    </div>
  );
};
