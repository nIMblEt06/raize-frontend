"use client";
import BetActions from "@/components/ContBetDetailView/BetActions";
import BetDetails from "@/components/ContBetDetailView/BetDetails";
import React, { useContext, useEffect, useState } from "react";
import "./styles.scss";
import { usePathname, useRouter } from "next/navigation";
import { useAccount, useContract } from "@starknet-react/core";
import abi from "../../../../abi/AMMMarketABI.json";
import {
  CONTRACT_ADDRESS,
  FPMM_CONTRACT_ADDRESS,
} from "@/components/helpers/constants";
import { FPMMMarket, FPMMOutcome, Market } from "@/components/helpers/types";
import { NextPage } from "next";
import { enqueueSnackbar } from "notistack";
import CustomLogo from "@/components/common/CustomIcons";
import { BACK_LOGO } from "@/components/helpers/icons";
import { Box, Skeleton } from "@mui/material";
import { HiLockClosed } from "react-icons/hi";

const BetDetailView: NextPage = () => {
  const router = useRouter();
  const { address } = useAccount();
  const [market, setMarket] = useState<FPMMMarket | null>(null);
  const [outcomes, setOutcomes] = useState<FPMMOutcome[]>([]);
  const handleBack = () => {
    router.push("/");
  };
  const pathname = usePathname();

  const { contract } = useContract({
    address: FPMM_CONTRACT_ADDRESS,
    abi: abi,
  });

  useEffect(() => {
    const getMarket = async () => {
      if (!contract) {
        return;
      }
      const encoded = pathname.split("/")[3];
      // const hexPart = encoded.slice(0, -4);
      // const marketId = parseInt(hexPart, 16);
      await contract.get_market(encoded).then(async (res: any) => {
        setMarket(res);
        let tempOutcomes: FPMMOutcome[] = [];
        for (let i = 0; i < res.num_outcomes; i++) {
          await contract
            .get_outcome(encoded, i)
            .then((outcome: FPMMOutcome) => {
              tempOutcomes.push(outcome);
            });
        }
        setOutcomes(tempOutcomes);
      });
    };
    getMarket();
  }, [contract, address, pathname]);

  const checkDeadline = (): boolean => {
    const currentTime = new Date().getTime();
    const deadline = new Date(parseInt(market?.deadline!) * 1000).getTime(); // * 1000 to convert seconds to ms
    return currentTime > deadline;
  };

  return (
    <div className='BetDetailView'>
      <div className='GoBack' onClick={handleBack}>
        <CustomLogo width={"30px"} height={"20px"} src={BACK_LOGO} />
        <div>Back</div>
      </div>
      <div className='DetailsAndActions'>
        <BetDetails
          // category={market?.category || ""}
          // heading={market?.name || ""}
          // logo={market?.image || ""}
          // subHeading={market?.description || ""}
          heading={"B"}
          logo={"C"}
          subHeading={"D"}
        />
        {market ? (
          !market?.is_active || checkDeadline() ? (
            <Box className='MarketClosed'>
              <span>
                This Market is now closed, please wait patiently for the results
                to get declared, and be sure to claim your winnings!
              </span>
            </Box>
          ) : (
            <BetActions
              duration={market?.deadline || ""}
              outcomes={outcomes!}
            />
          )
        ) : (
          <Skeleton />
        )}
      </div>
    </div>
  );
};

export default BetDetailView;
