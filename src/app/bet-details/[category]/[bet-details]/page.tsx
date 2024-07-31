"use client";
import BetActions from "@/components/BetDetailView/BetActions";
import BetDetails from "@/components/BetDetailView/BetDetails";
import React, { useContext, useEffect, useState } from "react";
import "./styles.scss";
import { usePathname, useRouter } from "next/navigation";
import { useAccount, useContract } from "@starknet-react/core";
import abi from "../../../../abi/ContractABI.json";
import { CONTRACT_ADDRESS } from "@/components/helpers/constants";
import { Market } from "@/components/helpers/types";
import { NextPage } from "next";
import { enqueueSnackbar } from "notistack";
import CustomLogo from "@/components/common/CustomIcons";
import { BACK_LOGO } from "@/components/helpers/icons";
import { Box, Skeleton } from "@mui/material";
import { HiLockClosed } from "react-icons/hi";

const BetDetailView: NextPage = () => {
  const router = useRouter();
  const { address } = useAccount();
  const [market, setMarket] = useState<Market | null>(null);
  const handleBack = () => {
    router.push("/");
  };
  const pathname = usePathname();

  const { contract } = useContract({
    address: CONTRACT_ADDRESS,
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
      await contract.get_market(marketId).then((res: any) => {
        setMarket(res);
      });
    };
    getMarket();
  }, [contract, address, pathname]);

  const checkDeadline = (): boolean => {
    const currentTime = new Date().getTime();
    const deadline = new Date(parseInt(market?.deadline!)).getTime();
    return currentTime > deadline;
  };

  return (
    <div className='BetDetailView'>
      <div className='GoBack' onClick={handleBack}>
        <CustomLogo width={"30px"} height={"20px"} src={BACK_LOGO} />
        <div>Back</div>
      </div>
      <BetDetails
        category={market?.category || ""}
        duration={market?.deadline || ""}
        heading={market?.name || ""}
        logo={market?.image || ""}
        subHeading={market?.description || ""}
        moneyInPool={market?.money_in_pool || 0}
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
            moneyInPool={market?.money_in_pool!}
            outcomes={market?.outcomes!}
            category={market?.category!}
          />
        )
      ) : (
        <Skeleton />
      )}
    </div>
  );
};

export default BetDetailView;
