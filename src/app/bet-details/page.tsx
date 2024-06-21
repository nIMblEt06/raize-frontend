"use client";
import BetActions from "@/components/BetDetailView/BetActions";
import BetDetails from "@/components/BetDetailView/BetDetails";
import React, { useContext, useEffect, useState } from "react";
import ArrowLeft from "../../../public/assets/icons/arrow.svg";
import "./styles.scss";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MarketContext } from "../context/MarketProvider";
import { useContract } from "@starknet-react/core";
import abi from "../../abi/ContractABI.json";
import { CONTRACT_ADDRESS } from "@/components/helpers/constants";
import { Market } from "@/components/helpers/types";

function BetDetailView() {
  const router = useRouter();
  const { currentMarket, setCurrentMarket } = useContext(MarketContext);
  const [market, setMarket] = useState<Market | null>(null);
  const handleBack = () => {
    router.push("/");
  };

  const { contract } = useContract({
    address: CONTRACT_ADDRESS,
    abi: abi,
  });

  useEffect(() => {
    // const market = sessionStorage.getItem("currentMarket");
    // console.log(market);

    const getMarket = () => {
      if (!contract) {
        return;
      }
      contract.getMarket(currentMarket).then((res: any) => {
        setMarket(res);
        // sessionStorage.setItem("currentMarket",currentMarket.toString());
      });
    };
    getMarket();
  }, []);

  return (
    <div className='BetDetailView'>
      <div className='GoBack' onClick={handleBack}>
        <Image src={ArrowLeft} alt='Arrow' width={20} height={20} />
        <div>Back</div>
      </div>
      <BetDetails
        category={market?.category || ""}
        duration={market?.deadline || ""}
        heading={market?.name || ""}
        logo={market?.image || ""}
        subHeading={market?.description || ""}
        moneyInPool={market?.moneyInPool || 0}
        betToken={market?.betToken || ""}
      />

      <BetActions
        moneyInPool={market?.moneyInPool!}
        betToken={market?.betToken!}
        outcomes={market?.outcomes!}
      />
    </div>
  );
}

export default BetDetailView;
