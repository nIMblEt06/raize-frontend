import React from "react";
import "./styles.scss";
import { Modal } from "@mui/material";

interface Props {
  open: boolean;
  handleClose: () => void;
}

export const BetActionModal = ({ open, handleClose }: Props) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="BetActionModalWrapper">
        <span className="TeamName">US Cremonese</span>
        <div className="OddPrice">
          <span className="Label">Current Price:</span>
          <span className="Price">1.65</span>
        </div>
        <input
          className="InputField"
          type="number"
          id="numberInput"
          name="numberInput"
          placeholder="0.00"
          required
        />
        <div className="ActionBtn">Place Bet</div>
      </div>
    </Modal>
  );
};
