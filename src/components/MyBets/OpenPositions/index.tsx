import React from "react";
import "./styles.scss";
import Image from "next/image";
import StarknetLogo from "../../../../public/assets/logos/starknet.svg";

function OpenPositions() {
  return (
    <div className='OpenPositions'>
      <div className='Heading'>Open Positions</div>
      <div className='Container'>
        <div className='Headings'>
          <p className='Status'>Status</p>
          <p className='Event'>Event</p>
          <p className='DatePlaced'>Date Placed</p>
          <p className='StakedAmount'>Staked Amount</p>
          <p className='Prediction'>Prediction</p>
        </div>
        <div className='Data'>
          <p className='Status'>Win</p>
          <p className='Event'>Trump vs Biden</p>
          <p className='DatePlaced'>5:32 am, 15th June 2024</p>
          <p className='BetToken StakedAmount'>
            <Image
              src={StarknetLogo}
              width={15}
              height={15}
              alt={"tokenImage"}
            />{" "}
            10
          </p>
          <p className='Yes Prediction'>Yes</p>
        </div>
      </div>
    </div>
  );
}

export default OpenPositions;
