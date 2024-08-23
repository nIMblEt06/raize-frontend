"use client";
import { NextPage } from "next";

import { useAccount, useConnect } from "@starknet-react/core";
import { MenuItem, Select } from "@mui/material";
import { Box } from "@mui/material";
import "./styles.scss";
import CustomLogo from "@/components/common/CustomIcons";
import {
  ETH_LOGO,
  LORDS_LOGO,
  STARKNET_LOGO,
  USDC_LOGO,
} from "@/components/helpers/icons";
import { useContext, useEffect, useMemo, useState } from "react";
import { MarketContext } from "@/app/context/MarketProvider";
import { Outcome } from "@/components/helpers/types";
import {
  ETH_ADDRESS,
  LORDS_ADDRESS,
  STARK_ADDRESS,
  USDC_ADDRESS,
} from "@/components/helpers/constants";
import { getProbabilites, getString } from "@/components/helpers/functions";
import { usePathname } from "next/navigation";
import usePlaceBet from "@/components/hooks/usePlaceBet";
import useSwapTrade from "@/components/hooks/useSwapTrade";
import { enqueueSnackbar } from "notistack";

interface Props {
  outcomes: Outcome[];
  moneyInPool: number;
  category: string;
}

const BetActions: NextPage<Props> = ({ outcomes, moneyInPool, category }) => {
  const { address } = useAccount();
  const pathname = usePathname();
  const { connectors, connect } = useConnect();
  const { choice, setChoice } = useContext(MarketContext);
  const [betAmount, setBetAmount] = useState("");
  const [marketId, setMarketId] = useState(0);
  const [potentialWinnings, setPotentialWinnings] = useState(0);
  const [percent1, setPercent1] = useState(0);
  const [percent2, setPercent2] = useState(0);
  const [currentToken, setCurrentToken] = useState<string>(USDC_ADDRESS);

  const logoOptions = [
    { value: ETH_ADDRESS, label: "ETH", src: ETH_LOGO },
    { value: STARK_ADDRESS, label: "STRK", src: STARKNET_LOGO },
    { value: USDC_ADDRESS, label: "USDC", src: USDC_LOGO },
    { value: LORDS_ADDRESS, label: "LORDS", src: LORDS_LOGO },
  ];

  useEffect(() => {
    if (!outcomes) return;
    const percentages = getProbabilites(
      outcomes[0].bought_shares.toString(),
      outcomes[1].bought_shares.toString()
    );
    setPercent1(percentages[0]);
    setPercent2(percentages[1]);
  }, [outcomes]);

  useEffect(() => {
    const encoded = pathname.split("/")[3];
    const hexPart = encoded.slice(0, -4);
    const marketId = parseInt(hexPart, 16);
    setMarketId(marketId);
  }, [pathname]);

  const { quote } = useSwapTrade(currentToken, betAmount);

  const { balance, writeAsync } = usePlaceBet(
    marketId,
    betAmount,
    choice,
    currentToken,
    quote?.buyAmount
  );

  function handleBetAmount(value: string) {
    if (value == "") {
      setBetAmount("");
      setPotentialWinnings(0);
    } else {
      setBetAmount(value);
    }
  }

  useEffect(() => {
    if (currentToken == USDC_ADDRESS) {
      if (moneyInPool && betAmount != "") {
        if (choice == 0) {
          setPotentialWinnings(
            (parseFloat(betAmount) *
              (parseFloat(betAmount) +
                parseFloat(BigInt(moneyInPool).toString()) / 1e6)) /
              (parseFloat(betAmount) +
                parseFloat(outcomes[0].bought_shares.toString()) / 1e6)
          );
        } else {
          setPotentialWinnings(
            (parseFloat(betAmount) *
              (parseFloat(betAmount) +
                parseFloat(BigInt(moneyInPool).toString()) / 1e6)) /
              (parseFloat(betAmount) +
                parseFloat(outcomes[1].bought_shares.toString()) / 1e6)
          );
        }
      }
    } else {
      if (moneyInPool && betAmount != "" && quote) {
        if (choice == 0) {
          setPotentialWinnings(
            (quote?.buyAmountInUsd *
              (quote?.buyAmountInUsd +
                parseFloat(BigInt(moneyInPool).toString()) / 1e6)) /
              (quote?.buyAmountInUsd +
                parseFloat(outcomes[0].bought_shares.toString()) / 1e6)
          );
        } else {
          setPotentialWinnings(
            (quote?.buyAmountInUsd *
              (quote?.buyAmountInUsd +
                parseFloat(BigInt(moneyInPool).toString()) / 1e6)) /
              (quote?.buyAmountInUsd +
                parseFloat(outcomes[1].bought_shares.toString()) / 1e6)
          );
        }
      }
    }
  }, [choice, betAmount, quote, moneyInPool, currentToken]);

  const handleToast = (
    message: string,
    subHeading: string,
    type: string,
    hash?: string
  ) => {
    enqueueSnackbar(message, {
      //@ts-ignore
      variant: "custom",
      subHeading: subHeading,
      hash: hash,
      type: type,
      anchorOrigin: {
        vertical: "top",
        horizontal: "right",
      },
    });
  };

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
          <span className='Green'>
            {outcomes ? getString(outcomes[0].name) : "Yes"}
          </span>
          <Box className='RadioButtonContainer'>
            <span className='RadioLabel'>{percent1.toFixed(2)}%</span>
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
          <span className='Red'>
            {outcomes ? getString(outcomes[1].name) : "No"}
          </span>
          <Box className='RadioButtonContainer'>
            <span className='RadioLabel'>{percent2.toFixed(2)}%</span>
            <Box className='RadioButton'>
              <Box className='RadioButtonInner'></Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className='InputContainer'>
        <span className='Label'>Order Value</span>
        <Box className='InputWrapper'>
          <Box className='Input-Left'>
            <Box className='Starknet-logo'>
              <Select
                value={currentToken}
                onChange={(e) => setCurrentToken(e.target.value)}
                className='LogoSelect'
              >
                {logoOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <CustomLogo width='20px' height='20px' src={option.src} />
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <input
              className='InputField'
              type='number'
              id='numberInput'
              name='numberInput'
              value={betAmount}
              onChange={(e) => handleBetAmount(e.target.value)}
              placeholder='0.00'
              required
            />
          </Box>
          <span className='BalanceField'>
            $
            {betAmount
              ? currentToken !== USDC_ADDRESS && quote
                ? quote?.buyAmountInUsd
                : betAmount
              : "0"}{" "}
          </span>
        </Box>
        <span className='BalanceField'>
          {address
            ? "Balance: " + parseFloat(balance).toFixed(6)
            : "Please connect your wallet."}{" "}
        </span>
      </Box>
      <Box className='ReturnStats'>
        <span className='ReturnLabel'>Potential Winning</span>
        <Box className='ReturnValue'>
          <span className={betAmount == "" ? "Gray" : "Green"}>
            {potentialWinnings ? potentialWinnings.toFixed(5) : 0}
          </span>
          <Box className='Starknet-logo'>
            <CustomLogo src={USDC_LOGO} />
          </Box>
        </Box>
      </Box>
      {address ? (
        <Box onClick={() => writeAsync()} className={`ActionBtn`}>
          {betAmount == ""
            ? "Enter Amount"
            : parseFloat(balance) > parseFloat(betAmount)
            ? "Place Order"
            : "Insufficient Balance"}
        </Box>
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
