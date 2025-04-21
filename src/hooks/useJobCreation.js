import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useStakeRegistry } from "./useStakeRegistry";

export function useJobCreation() {
  const router = useRouter();
  const [jobType, setJobType] = useState();
  const [estimatedFee, setEstimatedFee] = useState(0);
  const [gasUnits, setGasUnits] = useState(0);
  const [argType, setArgType] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scriptFunction, setScriptFunction] = useState("");
  const [userBalance, setUserBalance] = useState(0);
  const [estimatedFeeInGwei, setEstimatedFeeInGwei] = useState(0);
  const [isLoading, setIsLoading] = useState(false);


  const [codeUrls, setCodeUrls] = useState([]);

  const handleCodeUrlChange = (event, jobType, jobId = null) => {
    if (event?.target) {
      const url = event.target.value;
      setCodeUrls((prev) => {
        const urls = prev[jobType] ? [...prev[jobType]] : [];
        if (jobId !== null) {
          urls[jobId] = url;
        } else {
          urls[0] = url;
        }
        return { ...prev, [jobType]: urls };
      });

      console.log(
        `Code URL for ${jobType} ${
          jobId !== null ? "linked job " + jobId : "main job"
        } changed to:`,
        url
      );
    }
  };

  useEffect(() => {
    fetchTGBalance();
  });

  const estimateFee = async (
    timeframeInSeconds,
    intervalInSeconds,
    codeUrls
  ) => {
    try {
      const executionCount = Math.ceil(timeframeInSeconds / intervalInSeconds);

      let totalFeeTG = 0;
      console.log("Ipfs:", codeUrls);

      if (codeUrls) {
        try {
          const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
          const response = await fetch(
            `${API_BASE_URL}/api/fees?ipfs_url=${encodeURIComponent(
              codeUrls
            )}`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );
          console.log("response", response);

          if (!response.ok) {
            throw new Error("Failed to get fees");
          }

          const data = await response.json();
          console.log("Response data:", data);

          if (data.error) {
            throw new Error(data.error);
          }

          totalFeeTG = Number(data.total_fee) * executionCount;

          const stakeAmountEth = totalFeeTG * 0.001;

          console.log("Total TG fee required:", totalFeeTG.toFixed(18), "TG");

          const stakeAmountGwei = ethers.parseUnits(
            (stakeAmountEth * 1e9).toFixed(0),
            "gwei"
          );
          const estimatedFeeInGwei = stakeAmountGwei;
          console.log("Stake amount in Gwei:", estimatedFeeInGwei);

          setEstimatedFeeInGwei(estimatedFeeInGwei);
        } catch (error) {
          console.error("Error getting task fees:", error);
          toast.warning("Failed to get task fees. Using base fee estimation.");
        }
      }

      setEstimatedFee(totalFeeTG);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error estimating fee:", error);
      toast.error("Error estimating fee: " + error.message);
    }
  };

  const { stakeRegistryAddress, stakeRegistryImplAddress, stakeRegistryABI } =
    useStakeRegistry();

  const fetchTGBalance = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      const stakeRegistryContract = new ethers.Contract(
        stakeRegistryAddress,
        ["function getStake(address) view returns (uint256, uint256)"],
        provider
      );

      const [_, tgBalance] = await stakeRegistryContract.getStake(userAddress);
      console.log("Raw TG Balance:", tgBalance.toString());
      setUserBalance(ethers.formatEther(tgBalance));
    } catch (error) {
      console.error("Error fetching TG balance:", error);
      toast.error("Failed to fetch TG balance");
    }
  };

  const handleSubmit = async (
    stakeRegistryAddress,
    stakeRegistryABI,
    jobdetails
  ) => {
    if (!jobType) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      if (typeof window.ethereum === "undefined") {
        throw new Error("Please install MetaMask to use this feature");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const updatedJobDetails = jobdetails.map((job) => ({
        ...job,
        job_cost_prediction: estimatedFee,
      }));
      console.log("updated",updatedJobDetails);

      if (userBalance < estimatedFee) {
        const requiredEth = (0.001 * estimatedFee).toFixed(18);
        const contract = new ethers.Contract(
          stakeRegistryAddress,
          stakeRegistryABI,
          signer
        );

        console.log("Staking ETH amount:", requiredEth);
        
        const tx = await contract.stake(
          ethers.parseEther(requiredEth.toString()),
          { value: ethers.parseEther(requiredEth.toString()) }
        );

        await tx.wait();
        console.log("Stake transaction confirmed: ", tx.hash);
        toast.success("ETH staked successfully!");
      }

      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

      const response = await fetch(`${API_BASE_URL}/api/jobs`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Origin: "https://triggerx.network",
        },
        body: JSON.stringify(updatedJobDetails),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create job");
      }

      console.log("Job created successfully");
      setIsModalOpen(false);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating job:", error);
      toast.error("Error creating job: " + error.message);
    }
  };

  const handleStake = async (estimatedFee) => {
    setIsModalOpen(false);
    setIsLoading(false);
    await handleSubmit(jobType, estimatedFee);
  };

  const handleScriptFunctionChange = (event) => {
    if (event && event.target) {
      const func = event.target.value;
      setScriptFunction(func);
      console.log("Script function changed to:", func);
    }
  };

  const handleJobTypeChange = (value) => {
    const numericType = parseInt(value);
    console.log("Setting job type:", numericType);
    setJobType(numericType);
  };

  return {
    jobType,
    setJobType: handleJobTypeChange,
    estimatedFee,
    setEstimatedFee,
    isLoading,
    setIsLoading,
    isModalOpen,
    argType,
    setIsModalOpen: (value) => {
      console.log("Setting modal open:", value);
      setIsModalOpen(value);
    },
    estimateFee,
    handleSubmit,
    handleStake,
    scriptFunction,
    handleScriptFunctionChange,
    userBalance,
  };
}
