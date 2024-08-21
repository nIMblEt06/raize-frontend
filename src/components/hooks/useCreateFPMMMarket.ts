import {
  useAccount,
  useContract,
  useContractWrite,
  useWaitForTransaction,
} from "@starknet-react/core";
import { useEffect, useMemo } from "react";
import { cairo } from "starknet";
import { CONTRACT_ADDRESS } from "../helpers/constants";
import abi from "../../abi/ContractABI.json";
import { enqueueSnackbar } from "notistack";
import axios from "axios";

interface Data {
  heading: string;
  category: string;
  description: string;
  outcome1: string;
  outcome2: string;
  deadline: Date;
  image: string;
  fightImage?: string;
}

function useCreateFPMMMarket({
  heading,
  category,
  deadline,
  description,
  image,
  outcome1,
  outcome2,
  fightImage,
}: Data) {
  const handleToast = (
    message: string,
    subHeading: string,
    type: string,
    hash?: string
  ) => {
    enqueueSnackbar(message, {
      //@ts-ignore
      variant: "custom",
      subHeading: subHeading,
      hash: hash,
      type: type,
      anchorOrigin: {
        vertical: "top",
        horizontal: "right",
      },
    });
  };

  const createFPMMMarket = async () => {
    await axios
      .post(`${process.env.SERVER_URL}/create-market`, {
        question: heading,
        category,
        deadline,
        description,
        icon: image,
        outcome1,
        outcome2,
        fightImage,
      })
      .then((res) => {
        handleToast(
          "Market Created",
          "Your market has been created",
          "success"
        );
      })
      .catch((error) => {
        console.error("Error creating market:", error);
      });
  };

  return { createFPMMMarket };
}

export default useCreateFPMMMarket;
