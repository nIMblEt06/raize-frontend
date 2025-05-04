"use client";
import React, { useState } from "react";
import "./styles.scss";
import { FaArrowLeft } from "react-icons/fa6";
import { BetActionModal } from "./BetActionModal";

export const SportsBetActionCard = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <div className="SportsBetAction" onClick={handleOpen}>
        <span className="TeamName">US Cremonese</span>
        <div className="OddsContainer">
          <span className="CurrentOdd">1.65</span>
          <span className="Label">
            <FaArrowLeft />
          </span>
          <span className="PastOdd">1.61</span>
        </div>
      </div>
      <BetActionModal open={open} handleClose={handleClose} />
    </>
  );
};
