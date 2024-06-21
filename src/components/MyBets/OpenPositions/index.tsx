import React from "react";
import "./styles.scss";
import Image from "next/image";
import StarknetLogo from "../../../../public/assets/logos/starknet.svg";
import { Market } from "@/components/helpers/types";
import { getNumber, getString } from "@/components/helpers/functions";

interface Props {
  openMarkets: Market[];
  openBets: any;
}
function OpenPositions({ openMarkets, openBets }: Props) {
  return (
    <div className='OpenPositions'>
      <div className='Heading'>Open Positions</div>
      <div className='Container'>
        <div className='Headings'>
          <p className='Status'>Status</p>
          <p className='Event'>Event</p>
          <p className='DatePlaced'>Bet Deadline</p>
          <p className='StakedAmount'>Staked Amount</p>
          <p className='Prediction'>Prediction</p>
        </div>
        {openMarkets.map((market, index) => (
          <div className='Data' key={index}>
            <p className='Status'>Open</p>
            <p className='Event'>{market.name}</p>
            <p className='DatePlaced'>
              {new Date(parseInt(market.deadline)).toString().split("GMT")[0]}
            </p>
            <p className='BetToken StakedAmount'>
              <Image
                src={StarknetLogo}
                width={15}
                height={15}
                alt={"tokenImage"}
              />{" "}
              {openBets.length > 0 && getNumber(openBets[index][1].amount)}
            </p>
            <p className='Yes Prediction'>{openBets.length > 0 && getString(openBets[index][0].name)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OpenPositions;
