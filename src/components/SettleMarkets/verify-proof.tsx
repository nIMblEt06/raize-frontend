import { useState, useEffect, useMemo } from "react";
// import { Reclaim } from "@reclaimprotocol/js-sdk";
import { useAccount } from "@starknet-react/core";
import { RpcProvider, Contract} from "starknet";
import { Box } from "@mui/material";
import "./styles.scss";
export default function VerifyProof(props: any) {
  const { account } = useAccount();
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  const handleVerifyProof = async () => {
    try {
     if(!account){
      setError("No account available. Please connect your wallet.");
      return;
     }
      setLoading(true);
      const provider = new RpcProvider({
        nodeUrl: "https://starknet-sepolia.public.blastapi.io",
      });
      const reclaimAddress =
        "0x0765f3f940f7c59288b522a44ac0eeba82f8bf71dd03e265d2c9ba3521466b4e"; 

      const { abi: reclaimAbi } = await provider.getClassAt(reclaimAddress);
      if (reclaimAbi === undefined) {
        throw new Error("no abi.");
      }
      const ReclaimContract = new Contract(
        reclaimAbi,
        reclaimAddress,
        provider
      );
      console.log(ReclaimContract);
      ReclaimContract.connect(account);
      console.log(props.data.proof);
      const myCall = ReclaimContract.populate("verify_proof", props.data);
      
      const res = await ReclaimContract.verify_proof(myCall.calldata);
      let hash = await provider.waitForTransaction(res.transaction_hash);
      setLoading(false);
      // @ts-ignore
      setTransactionHash(hash.transaction_hash);
      setVerified(true);
      console.log("hash", hash);
      if (props.onVerified) {
        props.onVerified(true);  // Pass `true` to indicate success
      }
    } catch (error) {
      console.error("Verification failed:", error);
      setLoading(false);
      setError("Verification failed. Please try again.");
      setVerified(false);
      if (props.onVerified) {
        props.onVerified(false);  // Pass `false` to indicate failure
      }
    }
  };

  return (
    <div>
      {!loading && !verified && ( <Box className='Submit'>
        <button onClick={handleVerifyProof} className="SubmitButton">Verify Proof</button>
        </Box>
      )}
      {verified && transactionHash && (
        <div className="flex flex-col text-center">
          <p className="text-green-500 font-semibold">
            Verification completed.
          </p>
          <a
            href={`https://sepolia.starkscan.co/tx/${transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400"
          >
            See Transaction on the Explorer
          </a>
        </div>
      )}
      {/* {error && <p className="text-red-500 font-semibold">{error}</p>} */}
    </div>
  );
}
