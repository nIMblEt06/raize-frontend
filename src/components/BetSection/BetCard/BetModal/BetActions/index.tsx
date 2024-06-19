"use client";
import { NextPage } from "next";

import { useAccount, useConnect } from "@starknet-react/core";

import { Box } from "@mui/material";
import "./styles.scss";
import CustomLogo from "@/components/common/CustomIcons";
import { STARKNET_LOGO } from "@/components/helpers/icons";

interface Props {
  prediction: string;
  setPrediction: (prediction: string) => void;
}

const BetActions: NextPage<Props> = ({ prediction, setPrediction }) => {
  const { address } = useAccount();
  const { connectors, connect } = useConnect();
  return (
    <Box className="BetActions">
      <span className="BetActions-Label">Your Prediction</span>
      <Box className="BetOptionsContainer">
        <span className="BetOptionsLabel">Choose your option</span>
        <Box
          onClick={() => {
            setPrediction("yes");
          }}
          className={prediction === "yes" ? "BetOptionActive" : "BetOption"}
        >
          <span className="Green">Yes</span>
          <Box className="RadioButtonContainer">
            <span className="RadioLabel">21.2%</span>
            <Box className="RadioButton">
              <Box className="RadioButtonInner"></Box>
            </Box>
          </Box>
        </Box>
        <Box
          onClick={() => {
            setPrediction("no");
          }}
          className={prediction === "no" ? "BetOptionActive" : "BetOption"}
        >
          <span className="Red">No</span>
          <Box className="RadioButtonContainer">
            <span className="RadioLabel">21.2%</span>
            <Box className="RadioButton">
              <Box className="RadioButtonInner"></Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className="InputContainer">
        <span className="Label">Order Value</span>
        <Box className="InputWrapper">
          <Box className="Starknet-logo">
            <CustomLogo src={STARKNET_LOGO} />
          </Box>
          <input
            className="InputField"
            type="number"
            id="numberInput"
            name="numberInput"
            required
          />
        </Box>
      </Box>
      <Box className="ReturnStats">
        <span className="ReturnLabel">Potential Winning</span>
        <Box className="ReturnValue">
          <span className="Green">24.00</span>
          <Box className="Starknet-logo">
            <CustomLogo src={STARKNET_LOGO} />
          </Box>
        </Box>
      </Box>
      {address ? (
        <Box className="ActionBtn">Place Order</Box>
      ) : (
        <Box
          onClick={() => connect({ connector: connectors[0] })}
          className="ActionBtn"
        >
          Connect Wallet
        </Box>
      )}
    </Box>
  );
};

export default BetActions;
