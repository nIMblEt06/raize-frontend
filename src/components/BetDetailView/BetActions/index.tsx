"use client";
import { NextPage } from "next";

import {
  useAccount,
  useConnect,
  useContract,
  useContractWrite,
  useWaitForTransaction,
} from "@starknet-react/core";

import { Box } from "@mui/material";
import "./styles.scss";
import CustomLogo from "@/components/common/CustomIcons";
import { ETH_LOGO, STARKNET_LOGO, USDC_LOGO } from "@/components/helpers/icons";
import { useContext, useEffect, useMemo, useState } from "react";
import { MarketContext } from "@/app/context/MarketProvider";
import { Outcome } from "@/components/helpers/types";
import { num } from "starknet";
import {
  CONTRACT_ADDRESS,
  ETH_ADDRESS,
  USDC_ADDRESS,
} from "@/components/helpers/constants";
import abi from "../../../abi/ContractABI.json";
import tokenABI from "../../../abi/ERC20ABI.json";
import { getProbabilites, getString } from "@/components/helpers/functions";
import { enqueueSnackbar } from "notistack";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  outcomes: Outcome[];
  moneyInPool: number;
  category: string;
}

const BetActions: NextPage<Props> = ({ outcomes, moneyInPool, category }) => {
  const { address } = useAccount();
  const router = useRouter();
  const pathname = usePathname();
  const { connectors, connect } = useConnect();
  const { choice, setChoice } = useContext(MarketContext);
  const [betAmount, setBetAmount] = useState("");
  const [potentialWinnings, setPotentialWinnings] = useState(0);
  const [balance, setBalance] = useState("");
  const [decimals, setDecimals] = useState(0);
  const [percent1, setPercent1] = useState(0);
  const [percent2, setPercent2] = useState(0);

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
    if (moneyInPool && betAmount != "") {
      getPotentialWinnings(betAmount);
    }
  }, [choice]);

  function getPotentialWinnings(value: string) {
    if (value == "") {
      setBetAmount("");
      setPotentialWinnings(0);
    } else {
      setBetAmount(value);
      if (choice == 0) {
        setPotentialWinnings(
          (parseFloat(value) *
            (parseFloat(value) +
              parseFloat(BigInt(moneyInPool).toString()) / 1e6)) /
            (parseFloat(value) +
              parseFloat(outcomes[0].bought_shares.toString()) / 1e6)
        );
      } else {
        setPotentialWinnings(
          (parseFloat(value) *
            (parseFloat(value) +
              parseFloat(BigInt(moneyInPool).toString()) / 1e6)) /
            (parseFloat(value) +
              parseFloat(outcomes[1].bought_shares.toString()) / 1e6)
        );
      }
    }
  }
  const { contract } = useContract({
    address: CONTRACT_ADDRESS,
    abi: abi,
  });

  const { contract: tokenContract } = useContract({
    address: USDC_ADDRESS,
    abi: tokenABI,
  });

  const calls = useMemo(() => {
    const encoded = pathname.split("/")[3];
    const hexPart = encoded.slice(0, -4);
    const marketId = parseInt(hexPart, 16);
    if (!address || !contract || betAmount == "" || !tokenContract) return [];
    return [
      tokenContract.populateTransaction["approve"]!(
        CONTRACT_ADDRESS,
        BigInt(parseFloat(betAmount) * 10 ** decimals)
      ),
      contract.populateTransaction["buy_shares"]!(
        marketId,
        choice,
        BigInt(parseFloat(betAmount) * 10 ** decimals)
      ),
    ];
  }, [contract, address, choice, betAmount, tokenContract]);

  const { writeAsync, data, isError, isSuccess } = useContractWrite({
    calls,
  });

  useEffect(() => {
    if (!tokenContract || !address) return;
    tokenContract.balance_of(address).then((res: any) => {
      tokenContract.decimals().then((resp: any) => {
        const balance = Number(res) / 10 ** Number(resp);
        setBalance(balance.toString());
        setDecimals(Number(resp));
      });
    });
  }, [tokenContract, address, betAmount]);

  const { isPending: pending, isSuccess: success } = useWaitForTransaction({
    hash: data?.transaction_hash,
  });

  useEffect(() => {
    if (data && pending) {
      handleToast(
        "Transaction Pending",
        "Your transaction is being processed, please wait for a few seconds.",
        "info",
        data!.transaction_hash
      );
    }
    if (isError) {
      handleToast(
        "Oh shoot!",
        "Something unexpected happened, check everything from your side while we check what happened on our end and try again.",
        "info"
      );
    }
    if (data && success || data && !pending) {
      handleToast(
        "Prediction Placed Successfully!",
        "Watch out for the results in “My bets” section. PS - All the best for this and your next prediction.",
        "success",
        data!.transaction_hash
      );
    }
  }, [data, isError, pending, success]);

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
              <CustomLogo src={USDC_LOGO} />
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
          <span className='InputField'>Balance: {parseFloat(balance)} </span>
        </Box>
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
          {betAmount == "" ? "Enter Amount" : "Place Order"}
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
