"use client";
import { NextPage } from "next";

import { useAccount, useConnect } from "@starknet-react/core";

import { Box } from "@mui/material";
import "./styles.scss";
import CustomLogo from "@/components/common/CustomIcons";
import { ETH_LOGO, STARKNET_LOGO } from "@/components/helpers/icons";
import { useContext, useEffect, useState } from "react";
import { MarketContext } from "@/app/context/MarketProvider";
import { Outcome } from "@/components/helpers/types";
import { num } from "starknet";
import { ETH_ADDRESS } from "@/components/helpers/constants";

interface Props {
  outcomes: Outcome[];
  betToken: string;
}

const BetActions: NextPage<Props> = ({ outcomes, betToken }) => {
  const { address } = useAccount();
  const { connectors, connect } = useConnect();
  const { choice, setChoice } = useContext(MarketContext);

  const [percent1, setPercent1] = useState(0);
  const [percent2, setPercent2] = useState(0);

  useEffect(() => {
    outcomes &&
      setPercent1(
        (parseFloat(outcomes[0].boughtShares.toString()) /
          1e18 /
          (parseFloat(outcomes[0].boughtShares.toString()) / 1e18 +
            parseFloat(outcomes[1].boughtShares.toString()) / 1e18)) *
          100
      );
    outcomes &&
      setPercent2(
        (parseFloat(outcomes[1].boughtShares.toString()) /
          1e18 /
          (parseFloat(outcomes[0].boughtShares.toString()) / 1e18 +
            parseFloat(outcomes[1].boughtShares.toString()) / 1e18)) *
          100
      );
  }, [outcomes]);

  return (
    <Box className='BetActions'>
      <span className='BetActions-Label'>Your Prediction</span>
      <Box className='BetOptionsContainer'>
        <span className='BetOptionsLabel'>Choose your option</span>
        <Box
          onClick={() => {
            setChoice(0);
          }}
          className={choice === 0 ? "BetOptionActive" : "BetOption"}
        >
          <span className='Green'>Yes</span>
          <Box className='RadioButtonContainer'>
            <span className='RadioLabel'>{percent2}%</span>
            <Box className='RadioButton'>
              <Box className='RadioButtonInner'></Box>
            </Box>
          </Box>
        </Box>
        <Box
          onClick={() => {
            setChoice(1);
          }}
          className={choice === 1 ? "BetOptionActive" : "BetOption"}
        >
          <span className='Red'>No</span>
          <Box className='RadioButtonContainer'>
            <span className='RadioLabel'>{percent1}%</span>
            <Box className='RadioButton'>
              <Box className='RadioButtonInner'></Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className='InputContainer'>
        <span className='Label'>Order Value</span>
        <Box className='InputWrapper'>
          <Box className='Starknet-logo'>
            <CustomLogo
              src={
                betToken &&
                num.toHex(betToken).toString().toLowerCase() ==
                  ETH_ADDRESS.toLowerCase()
                  ? ETH_LOGO
                  : STARKNET_LOGO
              }
            />
          </Box>
          <input
            className='InputField'
            type='number'
            id='numberInput'
            name='numberInput'
            placeholder='0.00'
            required
          />
        </Box>
      </Box>
      <Box className='ReturnStats'>
        <span className='ReturnLabel'>Potential Winning</span>
        <Box className='ReturnValue'>
          <span className='Green'>24.00</span>
          <Box className='Starknet-logo'>
            <CustomLogo
              src={
                betToken &&
                num.toHex(betToken).toString().toLowerCase() ==
                  ETH_ADDRESS.toLowerCase()
                  ? ETH_LOGO
                  : STARKNET_LOGO
              }
            />
          </Box>
        </Box>
      </Box>
      {address ? (
        <Box className='ActionBtn'>Place Order</Box>
      ) : (
        <Box
          onClick={() => connect({ connector: connectors[0] })}
          className='ActionBtn'
        >
          Connect Wallet
        </Box>
      )}
    </Box>
  );
};

export default BetActions;
