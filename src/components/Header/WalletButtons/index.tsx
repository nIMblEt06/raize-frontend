"use client";
import { NextPage } from "next";
import "./styles.scss";
import { useEffect, useMemo, useState } from "react";
import { useAccount, useContract } from "@starknet-react/core";
import useDropdown from "@/components/hooks/useDropdown";

import ConnectWallet from "../ConnectWallet";
import CustomLogo from "@/components/common/CustomIcons";
import {
  ARGENT_LOGO,
  ARGENT_MOBILE_LOGO,
  BRAAVOS_LOGO,
  USDC_LOGO,
} from "@/components/helpers/icons";
import { useRouter } from "next/navigation";
import { CONTRACT_ADDRESS } from "@/components/helpers/constants";
import abi from "../../../abi/ContractABI.json";
import { getNumber } from "@/components/helpers/functions";
import { motion } from "framer-motion";
import { IoIosArrowDropdown } from "react-icons/io";
import WalletDropdown from "./WalletDropdown";
import { Box } from "@mui/material";

interface Props {}

const WalletButtons: NextPage<Props> = () => {
  const { address, connector } = useAccount();
  const router = useRouter();
  const [winnings, setWinnings] = useState("0");
  const {
    anchorEl: walletDropdownAnchor,
    open: openWalletDropdown,
    handleClose,
    handleClick,
  } = useDropdown();

  const shortenedAddress = useMemo(() => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, [address]);

  const getUserTotalWinnings = useMemo(() => {
    return async () => {
      if (!address) return;
      const contractInstance = await useContract({
        address: CONTRACT_ADDRESS,
        abi,
      }).contract;
      if (!contractInstance) return;
      const result = await contractInstance.get_user_total_claimable(address);
      setWinnings(getNumber(result.toString()));
      console.log(winnings, "winn");
    };
  }, [address]);

  useEffect(() => {
    getUserTotalWinnings();
  }, [getUserTotalWinnings]);

  const getLogo = useMemo(() => {
    switch (connector?.id) {
      case "argentX":
        return ARGENT_LOGO;
      case "argentWebWallet":
      case "argentMobile":
        return ARGENT_MOBILE_LOGO;
      case "braavos":
        return BRAAVOS_LOGO;
      default:
        return "";
    }
  }, [connector?.id]);

  const goToClaim = () => {
    router.push("/my-bets");
  };

  return (
    <div className="WalletButtons">
      {address ? (
        <div className="Buttons">
          {Number(winnings) > 0 && (
            <div className="ClaimButton" onClick={goToClaim}>
              <span>
                Claim{" "}
                <span className="Bold">
                  {Number(winnings) > 0 ? parseFloat(winnings).toFixed(3) : "0"}
                </span>
              </span>
              <div className="ClaimButtonLogo">
                <CustomLogo src={USDC_LOGO} />
              </div>
            </div>
          )}
          <motion.div
            whileTap={{ scale: 1.2 }}
            onClick={handleClick}
            className="AddressBtn"
          >
            <div className="AddressBtn-Logo">
              <Box className="WalletLogo">{<CustomLogo src={getLogo} />}</Box>
            </div>
            <span>{shortenedAddress}</span>
            <span className="DropdownIcon">
              <IoIosArrowDropdown />
            </span>
          </motion.div>
          <WalletDropdown
            anchorEl={walletDropdownAnchor}
            open={openWalletDropdown}
            handleClose={handleClose}
          />
        </div>
      ) : (
        <ConnectWallet />
      )}
    </div>
  );
};

export default WalletButtons;
