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
import {
  FPMMMarket,
  FPMMMarketInfo,
  FPMMOutcome,
  Market,
} from "@/components/helpers/types";
import { NextPage } from "next";
import { enqueueSnackbar } from "notistack";
import CustomLogo from "@/components/common/CustomIcons";
import { BACK_LOGO } from "@/components/helpers/icons";
import { Box, Skeleton } from "@mui/material";
import { HiLockClosed } from "react-icons/hi";
import axios from "axios";
import { handleToast } from "@/components/helpers/functions";

const BetDetailView: NextPage = () => {
  const router = useRouter();
  const { address } = useAccount();
  const [market, setMarket] = useState<FPMMMarket | null>(null);
  const [marketInfo, setMarketInfo] = useState<FPMMMarketInfo>();
  const [outcomes, setOutcomes] = useState<FPMMOutcome[]>([]);
  const [passedDeadline, setPassedDeadline] = useState(false);
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
      const hexPart = encoded.slice(0, -4);
      const marketId = parseInt(hexPart, 16);

      await axios
        .get(`${process.env.SERVER_URL}/get-current-market/${marketId}`)
        .then((res) => {
          setMarketInfo(res.data[0]);
        })
        .catch((err) => {
          handleToast(
            "Error Fetching Market Data",
            "Please try refreshing the page",
            "error"
          );
        });

      await contract.get_market(marketId).then(async (res: any) => {
        setMarket(res);
        let tempOutcomes: FPMMOutcome[] = [];
        for (let i = 0; i < res.num_outcomes; i++) {
          await contract
            .get_outcome(marketId, i)
            .then((outcome: FPMMOutcome) => {
              tempOutcomes.push(outcome);
            });
        }
        setOutcomes(tempOutcomes);
      });
    };
    getMarket();
  }, [contract, address, pathname]);

  useEffect(() => {
    if (market) {
      const checkDeadline = () => {
        const currentTime = new Date().getTime();
        const deadline = new Date(parseInt(market?.deadline) * 1000).getTime(); // * 1000 to convert seconds to ms
        setPassedDeadline(currentTime > deadline);
      };
      checkDeadline();
    }
  }, [market]);

  return (
    <div className='BetDetailView'>
      <div className='GoBack' onClick={handleBack}>
        <CustomLogo width={"30px"} height={"20px"} src={BACK_LOGO} />
        <div>Back</div>
      </div>
      {marketInfo && (
        <div className='DetailsAndActions'>
          <BetDetails
            heading={marketInfo.question}
            logo={marketInfo.icon}
            fightImage={marketInfo.fight_image}
            subHeading={marketInfo.description}
          />
          {market ? (
            <BetActions
              duration={market?.deadline || ""}
              outcomes={outcomes!}
              // settled={true}
              settled={market?.is_settled}
            />
          ) : (
            <Skeleton />
          )}
        </div>
      )}
    </div>
  );
};

export default BetDetailView;
