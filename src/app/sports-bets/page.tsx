import React from "react";
import "./styles.scss";
import { SportsBetWidget } from "@/components/SportsBetWidget";

function page() {
  return (
    <div className="SportsBetWrapper">
      <SportsBetWidget />
    </div>
  );
}

export default page;
