"use client";
import { NextPage } from "next";

import {
  useAccount,
  useConnect,
  useContract,
  useContractWrite,
} from "@starknet-react/core";

import { Box } from "@mui/material";
import "./styles.scss";
import CustomLogo from "@/components/common/CustomIcons";
import { ETH_LOGO, STARKNET_LOGO } from "@/components/helpers/icons";
import { useContext, useEffect, useMemo, useState } from "react";
import { MarketContext } from "@/app/context/MarketProvider";
import { Outcome } from "@/components/helpers/types";
import { num } from "starknet";
import {
  CONTRACT_ADDRESS,
  ETH_ADDRESS,
  STARK_ADDRESS,
} from "@/components/helpers/constants";
import abi from "../../../abi/ContractABI.json";
import tokenABI from "../../../abi/ERC20ABI.json";
import { getProbabilites } from "@/components/helpers/functions";
import { enqueueSnackbar } from "notistack";
import { useRouter } from "next/navigation";

interface Props {
  outcomes: Outcome[];
  betToken: string;
  moneyInPool: number;
}

const BetActions: NextPage<Props> = ({ outcomes, betToken, moneyInPool }) => {
  const { address } = useAccount();
  const router = useRouter();
  const { connectors, connect } = useConnect();
  const { choice, setChoice, currentMarket } = useContext(MarketContext);
  const [betAmount, setBetAmount] = useState("");
  const [potentialWinnings, setPotentialWinnings] = useState(0);
  const [allowance, setAllowance] = useState(false);
  const [balance, setBalance] = useState("");
  const [percent1, setPercent1] = useState(0);
  const [percent2, setPercent2] = useState(0);

  useEffect(() => {
    if (!outcomes) return;
    const percentages = getProbabilites(
      outcomes[0].boughtShares.toString(),
      outcomes[1].boughtShares.toString()
    );
    setPercent1(percentages[0]);
    setPercent2(percentages[1]);
  }, [outcomes]);

  function getPotentialWinnings(value: string) {
    if (value == "") {
      setBetAmount("");
      setPotentialWinnings(0);
    } else {
      setBetAmount(value);
      if (choice == 0) {
        setPotentialWinnings(
          (parseFloat(value) *
            (parseFloat(value) + parseFloat(BigInt(moneyInPool).toString()))) /
            (parseFloat(value) +
              parseFloat(outcomes[0].boughtShares.toString()) / 1e18)
        );
      } else {
        setPotentialWinnings(
          (parseFloat(value) * parseFloat(BigInt(moneyInPool).toString())) /
            (parseFloat(value) +
              parseFloat(outcomes[1].boughtShares.toString()) / 1e18)
        );
      }
    }
  }

  const { contract } = useContract({
    address: CONTRACT_ADDRESS,
    abi: abi,
  });

  const calls = useMemo(() => {
    if (!address || !contract || betAmount == "") return [];
    return contract.populateTransaction["buyShares"]!(
      currentMarket,
      choice,
      BigInt(parseFloat(betAmount) * 1e18)
    );
  }, [contract, address, currentMarket, choice, betAmount]);

  const { writeAsync, data, error } = useContractWrite({
    calls,
  });

  const { contract: tokenContract } = useContract({
    address: betToken ? num.getHexString(betToken) : STARK_ADDRESS,
    abi: tokenABI,
  });

  useEffect(() => {
    if (!tokenContract || !address || betAmount == "") return;
    tokenContract.allowance(address, CONTRACT_ADDRESS).then((res: any) => {
      setAllowance(res >= BigInt(parseFloat(betAmount) * 1e18));
    });
  }, [tokenContract, address, betAmount, betToken]);

  useEffect(() => {
    if (!tokenContract || !address) return;
    tokenContract.balance_of(address).then((res: any) => {
      setBalance(res.toString());
    });
  }, [tokenContract, address, betAmount, betToken]);

  const tokenCalls = useMemo(() => {
    if (!address || !tokenContract || betAmount == "") return [];
    return tokenContract.populateTransaction["approve"]!(
      CONTRACT_ADDRESS,
      BigInt(parseFloat(betAmount) * 1e18)
    );
  }, [tokenContract, address, betAmount]);

  const {
    writeAsync: approveAsync,
    data: tokenData,
    error: tokenError,
  } = useContractWrite({
    calls: tokenCalls,
  });

  useEffect(() => {
    if (data) {
      handleToast(
        "Prediction Placed Successfully!",
        "Watch out for the results in “My bets” section. PS - All the best for this and your next prediction.",
        data.transaction_hash
      );
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }
    if (tokenData) {
      handleToast(
        "Approval Successful!",
        "Let's head in and place some predictions!",
        tokenData.transaction_hash
      );
    }
    if (error || tokenError) {
      handleToast(
        "Oh shoot!",
        "Something unexpected happened, check everything from your side while we check what happened on our end and try again."
      );
    }
  }, [data, error, tokenData, tokenError]);

  const handleToast = (message: string, subHeading: string, hash?: string) => {
    enqueueSnackbar(message, {
      //@ts-ignore
      variant: "custom",
      subHeading: subHeading,
      hash: hash,
      type: "danger",
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
          <Box className='Input-Left'>
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
              value={betAmount}
              onChange={(e) => getPotentialWinnings(e.target.value)}
              placeholder='0.00'
              required
            />
          </Box>
          <span className='InputField'>
            Balance: {(parseFloat(balance) / 1e18).toString().slice(0, 7)}{" "}
          </span>
        </Box>
      </Box>
      <Box className='ReturnStats'>
        <span className='ReturnLabel'>Potential Winning</span>
        <Box className='ReturnValue'>
          <span className={betAmount == "" ? "Gray" : "Green"}>
            {potentialWinnings ? potentialWinnings : 0}
          </span>
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
        <Box
          onClick={() => (allowance ? writeAsync() : approveAsync())}
          className='ActionBtn'
        >
          {allowance ? "Place Order" : "Approve"}
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
