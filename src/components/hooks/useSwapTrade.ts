import {
  executeSwap,
  fetchBuildExecuteTransaction,
  fetchQuotes,
  InvokeSwapResponse,
  Quote,
} from "@avnu/avnu-sdk";
import { useAccount, useContract } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { USDC_ADDRESS } from "../helpers/constants";
import tokenABI from "../../abi/ERC20ABI.json";

function useSwapTrade(sellTokenAddress: string, sellAmount: string) {
  const { account, address } = useAccount();
  const [quote, setQuote] = useState<Quote>();
  const [swapCall, setSwapCall] = useState<any[]>();
  const { contract: tokenContract } = useContract({
    address: sellTokenAddress,
    abi: tokenABI,
  });
  const [decimals, setDecimals] = useState(6);

  useEffect(() => {
    const getBalance = async () => {
      if (!tokenContract || !address) return;
      tokenContract.decimals().then((resp: any) => {
        setDecimals(Number(resp));
      });
    };
    const getQuotes = async () => {
      if (
        !address ||
        sellAmount == "" ||
        Number(sellAmount) == 0 ||
        sellTokenAddress == USDC_ADDRESS
      )
        return;

      const params = {
        sellTokenAddress,
        buyTokenAddress: USDC_ADDRESS,
        sellAmount: BigInt(parseFloat(sellAmount) * 10 ** decimals),
        takerAddress: address,
        integratorFees: BigInt(200),
        integratorFeeRecipient:
          "0x0415a67af603225b38183c41ed88f54cf1e8da777deb34531845ead44fc08372",
        integratorName: "Raize",
      };
      const quotes: Quote[] = await fetchQuotes(params);
      let result = await fetchBuildExecuteTransaction(quotes[0].quoteId);
      const { calls } = result;
      setSwapCall(calls);
      setQuote(quotes[0]);
    };
    getBalance();
    getQuotes();
  }, [sellAmount, sellTokenAddress, address, decimals]);

  const executeTrade = async () => {
    if (account) {
      const response: InvokeSwapResponse = await executeSwap(account, quote!, {
        slippage: 0.06,
      });
      return response;
    }
  };

  return { quote, swapCall, executeTrade };
}

export default useSwapTrade;
