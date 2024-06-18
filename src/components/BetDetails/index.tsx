import React from "react";
import OpenPositions from "./OpenPositions";
import ClosedPositions from "./ClosedPositions";
import "./styles.scss";

function BetDetails() {
  return (
    <div className="MyBets">
        <OpenPositions />
        <ClosedPositions />
    </div>
  );
}

export default BetDetails;
