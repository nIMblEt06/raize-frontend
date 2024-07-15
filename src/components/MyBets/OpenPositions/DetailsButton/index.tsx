import { NextPage } from "next";
import "./styles.scss";
import { useState } from "react";
import DetailsModal from "../DetailsModal";

interface Props {
  name: string;
  date: string;
  amount: string;
  prediction: string;
}

const DetailsButton: NextPage<Props> = ({ name, date, amount, prediction }) => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false);
  const handleOpen = () => setOpenWalletModal(true);
  const handleClose = () => {
    setOpenWalletModal(false);
  };
  return (
    <>
      <span onClick={handleOpen} className="Details">
        Details
      </span>
      <DetailsModal
        open={openWalletModal}
        handleClose={handleClose}
        status={"Open"}
        event={name}
        date={date}
        amount={amount}
        prediction={prediction}
      />
    </>
  );
};

export default DetailsButton;
