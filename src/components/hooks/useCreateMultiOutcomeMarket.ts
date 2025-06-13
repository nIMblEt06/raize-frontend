import {
    useAccount,
    useContract,
    useContractWrite,
    useWaitForTransaction,
  } from "@starknet-react/core";
  import { useEffect, useMemo } from "react";
  import { cairo } from "starknet";
  import { CONTRACT_ADDRESS, MULTI_OUTCOME_MARKET_ADDRESS } from "../helpers/constants";
  import abi from "../../abi/ContractABI.json";
  import { enqueueSnackbar } from "notistack";
  import axios from "axios";
  import Abi from "../../abi/MultiOutcomeABI.json";
  interface Data {
    heading: string;
    category: string;
    description: string;
    outcome1: string;
    outcome2:string;
    outcome3:string;
    outcome4: string;
    deadline: Date;
    image: string;
    no_of_outcomes:number;
  }
  
  export function useCreateMulitOutcomeMarket({
    heading,
    deadline,
    description,
    image,
    outcome1,
    outcome2,
    outcome3,
    outcome4,
    no_of_outcomes
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
    const { address } = useAccount();
    const {
        contract
    }=useContract({
        address:MULTI_OUTCOME_MARKET_ADDRESS,
        abi:Abi
    })

    if(outcome4===""){
        outcome4='none'
    }

    const createNormalMarketCalls = useMemo(() => {
        if (
          !contract ||
          !address ||
          !heading ||
          !description ||
          !outcome1 ||
          !outcome2 ||
          !deadline ||
          !image ||
          !outcome3
        )
          return [];
        return [
          contract.populateTransaction["create_multi_outcome_market"]!(
            heading,
            description,
            cairo.tuple(outcome1, outcome2, outcome3, outcome4==="" ? "none" : outcome4),
            no_of_outcomes,
            image,
            deadline.getTime()
          ),
        ];
      }, [contract, address, heading, outcome1, outcome3, outcome2, outcome4,image, description, deadline, no_of_outcomes]);
    
    const { writeAsync, data, error, isError, isSuccess, isPending } =
    useContractWrite({
      calls: createNormalMarketCalls,
    });

    const createMultiOutcomeMarket = async () => {
        await writeAsync();
    };

    const { isPending: pending, isSuccess: success } = useWaitForTransaction({
        hash: data?.transaction_hash,
      });
    
      useEffect(() => {
        if (data && pending) {
          handleToast(
            "Transaction Pending",
            "Your market is being made, please wait for a few seconds.",
            "info",
            data!.transaction_hash
          );
        }
        if (isError) {
          handleToast(
            "Oh shoot!",
            "Something unexpected happened, check everything from your side while we check what happened on our end and try again.",
            "info"
          );
        }
        if ((data && success) || (data && !pending)) {
          handleToast(
            "Market Created Succesfully!",
            "Your market is now live, let's start trading.",
            "success",
            data!.transaction_hash
          );
        }
      }, [data, isError, pending, success]);
   
  
    return { createMultiOutcomeMarket };
  }
  
