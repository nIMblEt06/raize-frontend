"use client";
import { NextPage } from "next";
import "./styles.scss";

import { useState } from "react";
import { useConnect } from "@starknet-react/core";

import WalletModal from "./WalletModal";

interface Props {}

const ConnectWallet: NextPage<Props> = ({}) => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false);
  const handleOpen = () => setOpenWalletModal(true);
  const handleClose = () => {
    setOpenWalletModal(false);
  };
  return (
    <>
      <div className='ConnectBtn' onClick={handleOpen}>
        Connect Wallet
      </div>
      <WalletModal open={openWalletModal} handleClose={handleClose} />
    </>
  );
};

export default ConnectWallet;
