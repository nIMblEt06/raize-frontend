import React from "react";
import OpenPositions from "./OpenPositions";
import ClosedPositions from "./ClosedPositions";
import "./styles.scss";

function MyBets() {
  return (
    <div className="MyBets">
        <OpenPositions />
        <ClosedPositions />
    </div>
  );
}

export default MyBets;
