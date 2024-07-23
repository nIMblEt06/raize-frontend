import {
  executeSwap,
  fetchQuotes,
  InvokeSwapResponse,
  Quote,
} from "@avnu/avnu-sdk";
import { useAccount } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { USDC_ADDRESS } from "../helpers/constants";

function useSwapTrade(
  sellTokenAddress: string,
  sellAmount: string,
  decimals: number
) {
  const { account, address } = useAccount();
  const [quote, setQuote] = useState<Quote>();

  useEffect(() => {
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

      setQuote(quotes[0]);
    };
    getQuotes();
  }, [sellAmount, sellTokenAddress, address, decimals]);

  const executeTrade = async () => {
    if (account) {
      const response: InvokeSwapResponse = await executeSwap(account, quote!, {
        slippage: 0.1,
      });
      return response;
    }
  };

  return { quote, executeTrade };
}

export default useSwapTrade;
