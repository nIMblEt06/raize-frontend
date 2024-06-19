"use client";
import BetActions from "@/components/BetDetailView/BetActions";
import BetDetails from "@/components/BetDetailView/BetDetails";
import React, { useState } from "react";
import ArrowLeft from "../../../public/assets/icons/arrow.svg";
import "./styles.scss";
import Image from "next/image";
import { useRouter } from "next/navigation";

function BetDetailView() {
  const router = useRouter();
  const [prediction, setPrediction] = useState<string>("yes");
  const handleBack = () => {
    router.push("/");
  };
  return (
    <div className='BetDetailView'>
      <div className='GoBack' onClick={handleBack}>
        <Image src={ArrowLeft} alt='Arrow' width={20} height={20} />
        <div>Back</div>
      </div>
      <BetDetails
        name='Politics'
        duration='1d'
        heading='Trump vs Biden'
        logo='/assets/logos/uslogo.svg'
        subHeading='Will Trump win over Biden?'
      />

      <BetActions prediction={prediction} setPrediction={setPrediction} />
    </div>
  );
}

export default BetDetailView;
