"use client";
import { NextPage } from "next";

import { useAccount, useConnect } from "@starknet-react/core";
import { MenuItem, Select } from "@mui/material";
import { Box } from "@mui/material";
import "./styles.scss";
import CustomLogo from "@/components/common/CustomIcons";
import {
  CLOCK_ICON,
  ETH_LOGO,
  LORDS_LOGO,
  STARKNET_LOGO,
  USDC_LOGO,
} from "@/components/helpers/icons";
import { useContext, useEffect, useMemo, useState } from "react";
import { MarketContext } from "@/app/context/MarketProvider";
import { FPMMOutcome, Outcome } from "@/components/helpers/types";
import {
  ETH_ADDRESS,
  LORDS_ADDRESS,
  STARK_ADDRESS,
  USDC_ADDRESS,
} from "@/components/helpers/constants";
import {
  calcPrice,
  getProbabilites,
  getString,
  getTimeBetween,
} from "@/components/helpers/functions";
import { usePathname } from "next/navigation";
import usePlaceBet from "@/components/hooks/usePlaceBet";
import useSwapTrade from "@/components/hooks/useSwapTrade";
import { enqueueSnackbar } from "notistack";
import useFPMMPlaceBet from "@/components/hooks/useFPMMPlaceBet";
import useFPMMSellShare from "@/components/hooks/useFPMMSellShare";

interface Props {
  outcomes: FPMMOutcome[];
  duration: string;
}

const BetActions: NextPage<Props> = ({ outcomes, duration }) => {
  const { address } = useAccount();
  const pathname = usePathname();
  const { connectors, connect } = useConnect();
  const { choice, setChoice } = useContext(MarketContext);
  const [betAmount, setBetAmount] = useState("");
  const [marketId, setMarketId] = useState(0);
  const [potentialWinnings, setPotentialWinnings] = useState(0);
  const [price1, setPrice1] = useState(0);
  const [price2, setPrice2] = useState(0);
  const [currentToken, setCurrentToken] = useState<string>(STARK_ADDRESS);
  const [isBuying, setIsBuying] = useState(true);
  const [hoursRemaining, setHoursRemaining] = useState(0);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [minutes, setMinutesRemaining] = useState(0);

  const logoOptions = [
    { value: ETH_ADDRESS, label: "ETH", src: ETH_LOGO },
    { value: STARK_ADDRESS, label: "STRK", src: STARKNET_LOGO },
    { value: USDC_ADDRESS, label: "USDC", src: USDC_LOGO },
    { value: LORDS_ADDRESS, label: "LORDS", src: LORDS_LOGO },
  ];

  useEffect(() => {
    if (!outcomes || outcomes.length == 0) return;

    const percentages = calcPrice([
      outcomes[0].num_shares_in_pool.toString(),
      outcomes[1].num_shares_in_pool.toString(),
    ]);
    setPrice1(percentages[0]);
    setPrice2(percentages[1]);
  }, [outcomes]);

  useEffect(() => {
    const encoded = pathname.split("/")[3];
    const hexPart = encoded.slice(0, -4);
    const marketId = parseInt(hexPart, 16);
    setMarketId(marketId);
  }, [pathname]);

  const { quote } = useSwapTrade(currentToken, betAmount);
  // const { quote } = useSwapFPMMTrade(currentToken, betAmount);

  const { balance, writeAsync, minAmount } = useFPMMPlaceBet(
    marketId,
    betAmount,
    choice,
    currentToken,
    quote?.buyAmount
  );

  const {
    minAmount: minSellAmount,
    userMarketShare,
    writeAsync: writeSellAsync,
  } = useFPMMSellShare(marketId, betAmount, choice, currentToken);

  function handleBetAmount(value: string) {
    if (value == "") {
      setBetAmount("");
      setPotentialWinnings(0);
    } else {
      setBetAmount(value);
    }
  }

  const renderBuy = () => {
    return (
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
          {/* <span className='BalanceField'>
              ${betAmount ? betAmount : "0"}{" "}
            </span> */}
        </Box>
        <span className='BalanceField'>
          {address
            ? "Balance: " + parseFloat(balance).toFixed(6)
            : "Please connect your wallet."}{" "}
        </span>
      </Box>
    );
  };

  const renderSell = () => {
    return (
      <Box className='InputContainer'>
        <span className='Label'>Required Collateral</span>
        <Box className='InputWrapper'>
          <Box className='Input-Left'>
            <Box className='Starknet-logo'>
              <CustomLogo width='20px' height='20px' src={STARKNET_LOGO} />
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
          {/* <span className='BalanceField'>
              ${betAmount ? betAmount : "0"}{" "}
            </span> */}
        </Box>
        <span className='BalanceField'>
          {address
            ? "Shares: " + (parseFloat(userMarketShare) / 1e6).toFixed(2)
            : "Please connect your wallet."}{" "}
        </span>
      </Box>
    );
  };

  useEffect(() => {
    const currentTime = new Date().getTime();
    const deadline = new Date(parseInt(duration) * 1000).getTime();
    const timeBetween = getTimeBetween(deadline, currentTime);
    setDaysRemaining(timeBetween[0]);
    setHoursRemaining(timeBetween[1]);
    setMinutesRemaining(timeBetween[2]);
  }, [duration]);

  return (
    <Box>
      <Box className='BuySellSwitches'>
        <Box
          onClick={() => setIsBuying(true)}
          className={`BuySellSwitch ${isBuying ? "active" : ""}`}
        >
          <span className={`BuySellLabel ${isBuying ? "active" : ""}`}>
            Buy
          </span>
        </Box>
        <Box
          onClick={() => setIsBuying(false)}
          className={`BuySellSwitch ${!isBuying ? "active" : ""}`}
        >
          <span className={`BuySellLabel ${!isBuying ? "active" : ""}`}>
            Sell
          </span>
        </Box>
        <Box className='BetDuration'>
          <Box className='BetDetails-Logo'>
            <CustomLogo src={CLOCK_ICON} />
          </Box>
          <div>
            {daysRemaining}d: {hoursRemaining}h : {minutes}m
          </div>
        </Box>
      </Box>
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
              {outcomes.length > 0 ? getString(outcomes[0]?.name) : "Yes"}
            </span>
            <Box className='RadioButtonContainer'>
              <span className='RadioLabel'>${price1.toFixed(2)}</span>
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
              {outcomes.length > 0 ? getString(outcomes[1].name) : "No"}
            </span>
            <Box className='RadioButtonContainer'>
              <span className='RadioLabel'>${price2.toFixed(2)}</span>
              <Box className='RadioButton'>
                <Box className='RadioButtonInner'></Box>
              </Box>
            </Box>
          </Box>
        </Box>
        {isBuying ? renderBuy() : renderSell()}
      </Box>
      {isBuying ? (
        <Box className='ReturnStats'>
          <span className='ReturnLabel'>Avg. Price</span>
          <Box className='ReturnValue'>
            <span className={betAmount == "" ? "Gray" : "Green"}>
              {minAmount
                ? (
                    (parseFloat(betAmount) / parseFloat(minAmount)) *
                    1e6
                  ).toFixed(2)
                : 0}
            </span>
            <Box className='Starknet-logo'>
              <CustomLogo src={STARKNET_LOGO} />
            </Box>
          </Box>
        </Box>
      ) : (
        ""
      )}
      <Box className='ReturnStats'>
        <span className='ReturnLabel'>Shares {isBuying ? "" : "To Sell"} </span>
        <Box className='ReturnValue'>
          <span className={betAmount == "" ? "Gray" : "Green"}>
            {isBuying
              ? minAmount
                ? (parseFloat(minAmount) / 1e6).toFixed(2)
                : 0
              : minSellAmount
              ? (parseFloat(minSellAmount) / 1e6).toFixed(2)
              : 0}
          </span>
        </Box>
      </Box>
      {address ? (
        <Box
          onClick={isBuying ? () => writeAsync() : () => writeSellAsync()}
          className={`ActionBtn`}
        >
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
