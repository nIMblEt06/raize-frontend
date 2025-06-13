"use client";
import BetActions from "@/components/MultiOutcomeDetailView/MultiOutcomeBetActions";
import BetDetails from "@/components/MultiOutcomeDetailView/MutliOutcomeBetDetails";
import React, { act, useContext, useEffect, useState } from "react";
import "./styles.scss";
import { Uint256, uint256 } from "starknet";
import { usePathname, useRouter } from "next/navigation";
import { useAccount, useContract } from "@starknet-react/core";
import abi from "../../../../abi/MultiOutcomeABI.json";
import { MULTI_OUTCOME_MARKET_ADDRESS } from "@/components/helpers/constants";
import { MultiOutcomeMarket } from "@/components/helpers/types";
import { NextPage } from "next";
import { enqueueSnackbar } from "notistack";
import CustomLogo from "@/components/common/CustomIcons";
import { BACK_LOGO } from "@/components/helpers/icons";
import { Box, Skeleton } from "@mui/material";

const BetDetailView: NextPage = () => {
  const router = useRouter();
  const { address } = useAccount();
  const [market, setMarket] = useState<MultiOutcomeMarket | null>(null);
  const handleBack = () => {
    router.push("/");
  };
  const pathname = usePathname();

  const { contract } = useContract({
    address: MULTI_OUTCOME_MARKET_ADDRESS,
    abi: abi,
  });

  useEffect(() => {
    const getMarket = async () => {
      if (!contract) {
        return;
      }
      const encoded = pathname.split("/")[3];
      const hexPart = encoded.slice(0, -4);
      const marketId = parseInt(hexPart, 16);
      const actualMarketId=uint256.bnToUint256(marketId);
      console.log("The actual market id is", actualMarketId)
      const result=await contract.get_market(actualMarketId);
      console.log("The market is", result)
      setMarket(result)
    };
    getMarket();
  }, [contract, address, pathname]);

  const checkDeadline = (): boolean => {
    const currentTime = new Date().getTime();
    const deadline = new Date(parseInt(market?.deadline!)).getTime();
    return currentTime > deadline;
  };

  return (
    <div className="BetDetailView">
      <div className="GoBack" onClick={handleBack}>
        <CustomLogo width={"30px"} height={"20px"} src={BACK_LOGO} />
        <div>Back</div>
      </div>
      <BetDetails
        category={"Multi Outcome Market"}
        duration={market?.deadline || ""}
        heading={market?.name || ""}
        logo={market?.image || ""}
        subHeading={market?.description || ""}
        moneyInPool={market?.money_in_pool || 0}
      />
      {market ? (
        !market?.is_active || checkDeadline() ? (
          <Box className="MarketClosed">
            <span>
              This Market is now closed, please wait patiently for the results
              to get declared, and be sure to claim your winnings!
            </span>
          </Box>
        ) : (
          <BetActions
            moneyInPool={market?.money_in_pool!}
            outcomes={market?.outcomes!}
            category={"Multi Outcome Market"}
            no_of_outcomes={market.no_of_outcomes}
          />
        )
      ) : (
        <Skeleton />
      )}
    </div>
  );
};

export default BetDetailView;
