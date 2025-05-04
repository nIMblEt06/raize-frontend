"use client";
import React, { useState } from "react";
import "./styles.scss";
import { FaArrowLeft } from "react-icons/fa6";
import { BetActionModal } from "./BetActionModal";

interface Props {
  name: string;
  price: number;
}

export const SportsBetActionCard = ({ name, price }: Props) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <div className="SportsBetAction" onClick={handleOpen}>
        <span className="TeamName">{name}</span>
        <div className="OddsContainer">
          <span className="CurrentOdd">{price}</span>
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
