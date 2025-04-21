import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";

//ContractDetails.js
export function ContractDetails({
  contractAddress,
  setContractAddress,
  contractABI,
  setContractABI,
  functions,
  setFunctions,
  targetFunction,
  setTargetFunction,
  argumentType,
  setArgumentType,
  argsArray,
  setArgArray,
  ipfsCodeUrl,
  setIpfsCodeUrl,
}) {
  const [isFunctionOpen, setIsFunctionOpen] = useState(false);
  const [isArgumentTypeOpen, setIsArgumentTypeOpen] = useState(false);
  const [addressError, setAddressError] = useState("");
  const [ipfsCodeUrlError, setIpfsCodeUrlError] = useState("");

  const selected = functions.find(
    (f) =>
      `${f.name}(${f.inputs.map((input) => input.type).join(",")})` ===
      targetFunction
  );
  const hasArguments = selected?.inputs?.length > 0;

  const dropdownRef = useRef(null);
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFunctionOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dropdown2Ref = useRef(null);
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdown2Ref.current &&
        !dropdown2Ref.current.contains(event.target)
      ) {
        setIsArgumentTypeOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validateAddress = (address) => {
    const isValid = /^0x[a-fA-F0-9]{40}$/.test(address);
    setAddressError(isValid ? "" : "Invalid contract address");
    return isValid;
  };

  function extractFunctions(abi) {
    try {
      let abiArray;
      if (typeof abi === "string") {
        try {
          abiArray = JSON.parse(abi);
        } catch (e) {
          throw new Error("Invalid ABI string format");
        }
      } else if (Array.isArray(abi)) {
        abiArray = abi;
      } else if (typeof abi === "object") {
        abiArray = [abi];
      } else {
        throw new Error("ABI must be an array, object, or valid JSON string");
      }

      if (!Array.isArray(abiArray)) {
        throw new Error("Processed ABI is not an array");
      }

      const functions = abiArray
        .filter((item) => item && item.type === "function")
        .map((func) => ({
          name: func.name || "unnamed",
          inputs: func.inputs || [],
          outputs: func.outputs || [],
          stateMutability: func.stateMutability || "nonpayable",
          payable: func.payable || false,
          constant: func.constant || false,
        }));

      console.log("Extracted functions:", functions);
      return functions;
    } catch (error) {
      console.error("Error processing ABI:", error);
      return [];
    }
  }

  const handleContractAddressChange = async (e) => {
    const address = e.target.value;
    validateAddress(address);

    console.log("Contract address changed to:", address);
    setContractAddress(address);

    if (ethers.isAddress(address)) {
      const url = `https://optimism-sepolia.blockscout.com/api?module=contract&action=getabi&address=${address}`;
      try {
        const response = await axios.get(url);
        const data = response.data;
        if (data.status === "1") {
          const writableFunctions = extractFunctions(data.result).filter(
            (func) =>
              func.stateMutability === "nonpayable" ||
              func.stateMutability === "payable"
          );
          console.log("Setting writable functions:", writableFunctions);
          setFunctions(writableFunctions);

          // Extract and set events
          // const contractEvents = extractEvents(data.result);
          // console.log("Setting contract events:", contractEvents);
          // setEvents(contractEvents);

          setContractABI(data.result);
        } else {
          throw new Error(`Failed to fetch ABI: ${data.message}`);
        }
      } catch (error) {
        console.error("Error fetching ABI:", error.message);
        throw error;
      }
    } else {
      console.log("Invalid address, clearing ABI");
      setContractABI("");
    }
  };

  const handleFunctionChange = (e) => {
    const selectedValue = e.target.value;
    console.log("Function selection changed to:", selectedValue);
    setTargetFunction(selectedValue);

    // const func = functions.find(
    //   (f) =>
    //     `${f.name}(${f.inputs.map((input) => input.type).join(",")})` ===
    //     selectedValue
    // );
    // setSelectedFunction(func);

    // Reset argument type if function has no inputs
    // if (!func?.inputs?.length) {
    //   setArgumentType("static");
    // }

    // if (func) {
    //   setFunctionInputs(func.inputs.map(() => ""));
    //   setArgArray(func.inputs.map(() => ""));
    // } else {
    //   setFunctionInputs([]);
    //   setArgArray([]);
    // }
  };

  const handleFunctionSelect = (signature) => {
    handleFunctionChange({ target: { value: signature } });
    setIsFunctionOpen(false);
  };

  const handleArgumentTypeChange = (e) => {
    const newType = e.target.value;
    console.log("Argument type changed to:", newType);
    setArgumentType(newType);

    // Clear inputs when switching to dynamic
    // if (newType === "dynamic") {
    //   const emptyInputs = selectedFunction?.inputs?.map(() => "") || [];
    //   setFunctionInputs(emptyInputs);
    //   setArgArray(emptyInputs);
    // }
  };

  const isDisabled = argumentType === "dynamic";

  const handleInputChange = (index, value) => {
    const newInputs = [...argsArray];
    newInputs[index] = value;
    setArgArray(newInputs);

    // if (newInputs.every((input) => input !== "")) {
    //   const bytesArray = newInputs.map((arg) => {
    //     const hexValue = ethers.toBeHex(arg);
    //     return hexValue.length % 2 === 0 ? hexValue : `0x0${hexValue.slice(2)}`;
    //   });
    //   setArgumentsInBytes(bytesArray);
    // } else {
    //   console.log("Not all inputs filled, clearing bytes array");
    //   setArgumentsInBytes([]);
    // }
  };

  const handleCodeUrlChange = (e) => {
    const value = e.target.value;
    setIpfsCodeUrl(value);

    // Validation logic:
    if (!value) {
      setIpfsCodeUrlError("IPFS URL is required.");
    } else if (!isValidIpfsUrl(value)) {
      setIpfsCodeUrlError("Invalid IPFS URL format.");
    } else {
      setIpfsCodeUrlError(""); // Clear the error if valid
    }
  };

  const isValidIpfsUrl = (url) => {
    // Implement your IPFS URL validation logic here.
    // This is a placeholder; replace with a robust check.
    // Example:  Check if it starts with "ipfs://" or "https://ipfs.io/ipfs/"
    return url.startsWith("ipfs://") || url.startsWith("https://");
  };

  const selectedFunction = functions.find((func) => {
    const signature = `${func.name}(${func.inputs
      .map((input) => input.type)
      .join(",")})`;
    return signature === targetFunction;
  });
  const functionInputs = selectedFunction?.inputs || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <label
          htmlFor="contractAddress"
          className="block text-sm sm:text-base font-medium text-gray-300 text-nowrap"
        >
          Contract Address
        </label>
        <div className="w-full md:w-[70%] xl:w-[80%]">
          <input
            type="text"
            id="contractAddress"
            required
            value={contractAddress}
            onChange={handleContractAddressChange}
            placeholder="Your Contract address"
            className={`text-xs xs:text-sm sm:text-base w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none ${
              addressError ? "border-red-500" : "border-white/10"
            }`}
          />
          {addressError && (
            <p className="text-red-500 text-xs mt-1 ml-1">{addressError}</p>
          )}
        </div>
      </div>
      {contractAddress && (
        <div className="flex items-center justify-between gap-6">
          <h4 className="block text-sm sm:text-base font-medium text-gray-300 text-nowrap">
            Contract ABI
          </h4>
          <div className="w-[70%] xl:w-[80%] text-start ml-3">
            {contractABI ? (
              <svg
                className="w-5 h-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <div className="flex items-center ml-3">
                <h4 className="text-gray-400 pr-2 text-xs xs:text-sm sm:text-base">
                  Not Available{" "}
                </h4>
                <h4 className="text-red-400 mt-[2px]"> ✕</h4>
              </div>
            )}
          </div>
        </div>
      )}

      {contractAddress && !addressError && (
        <>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <label
              htmlFor="targetFunction"
              className="block text-sm sm:text-base font-medium text-gray-300 text-nowrap"
            >
              Target Function
            </label>

            <div
              ref={dropdownRef}
              className="relative w-full md:w-[70%] xl:w-[80%] z-50"
            >
              <div
                className="break-all text-xs xs:text-sm sm:text-base w-full bg-[#1a1a1a] text-white py-3 px-4 rounded-lg cursor-pointer border border-white/10 flex items-center justify-between"
                aria-required
                onClick={() => setIsFunctionOpen(!isFunctionOpen)}
              >
                {targetFunction || "Select a function"}
                <ChevronDown className="text-white text-xs ml-4" />
              </div>
              {isFunctionOpen && (
                <div className="absolute top-14 w-full bg-[#1a1a1a] border border-white/10 rounded-lg overflow-hidden shadow-lg">
                  {functions.map((func, index) => {
                    const signature = `${func.name}(${func.inputs
                      .map((input) => input.type)
                      .join(",")})`;
                    return (
                      <div
                        key={index}
                        className="py-3 px-4 hover:bg-[#333] cursor-pointer rounded-lg text-xs xs:text-sm sm:text-base text-clip"
                        onClick={() => handleFunctionSelect(signature)}
                      >
                        {signature}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {functions.length === 0 && contractAddress && (
            <h4 className="w-full md:w-[67%] xl:w-[78%] ml-auto text-xs xs:text-sm text-yellow-400">
              No writable functions found. Make sure the contract is verified on
              Blockscout / Etherscan.
            </h4>
          )}

          {targetFunction && (
            <>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <label
                  htmlFor="argumentType"
                  className="block text-sm sm:text-base font-medium text-gray-300 text-nowrap"
                >
                  Argument Type
                </label>
                <div
                  ref={dropdown2Ref}
                  className="relative w-full md:w-[70%] xl:w-[80%] z-30"
                >
                  <div
                    className={`text-xs xs:text-sm sm:text-base w-full bg-[#141414] text-white py-3 px-4 rounded-lg cursor-pointer border border-white/10 flex items-center justify-between ${
                      !hasArguments ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() =>
                      hasArguments && setIsArgumentTypeOpen(!isArgumentTypeOpen)
                    }
                  >
                    {argumentType === "static" ? "Static" : "Dynamic"}
                    <ChevronDown className="text-white text-xs" />
                  </div>
                  <h4 className="w-full ml-1 mt-3 text-xs text-gray-400">
                    {hasArguments
                      ? "Select how function arguments should be handled during execution"
                      : "No arguments required for this function"}
                  </h4>
                  {isArgumentTypeOpen && hasArguments && (
                    <div className="absolute top-14 w-full bg-[#1a1a1a] border border-white/10 rounded-lg overflow-hidden shadow-lg">
                      {["static", "dynamic"].map((type) => (
                        <div
                          key={type}
                          className="py-3 px-4 hover:bg-[#333] cursor-pointer rounded-lg text-xs xs:text-sm sm:text-base"
                          onClick={() => {
                            handleArgumentTypeChange({
                              target: { value: type },
                            });
                            setIsArgumentTypeOpen(false);
                          }}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* <h4 className="w-full md:w-[67%] xl:w-[78%] ml-auto text-xs text-gray-400">
                {hasArguments
                  ? "Select how function arguments should be handled during execution"
                  : "No arguments required for this function"}
              </h4> */}
            </>
          )}
        </>
      )}

      {targetFunction && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm sm:text-base font-medium text-gray-300 text-nowrap mb-6">
              Function Arguments
            </label>
            {isDisabled && (
              <span className="text-sm text-yellow-400 mb-6">
                Arguments disabled for dynamic type
              </span>
            )}
          </div>
          {!isDisabled &&
            functionInputs &&
            functionInputs.map((input, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row items-start md:items-center gap-6 justify-between mt-6"
              >
                <label className="block text-xs text-gray-400 text-nowrap">
                  {input.name || `Argument ${index + 1}`} ({input.type})
                </label>
                <input
                  type="text"
                  value={argsArray[index] || ""}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  className={`text-xs xs:text-sm sm:text-base w-full md:w-[60%] xl:w-[70%] bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none  ${
                    isDisabled
                      ? "opacity-50 cursor-not-allowed bg-gray-800"
                      : ""
                  }`}
                  placeholder={`Enter ${input.type}`}
                  disabled={isDisabled}
                  readOnly={isDisabled}
                  required
                />
              </div>
            ))}
        </div>
      )}

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <label
          htmlFor="ipfsCodeUrl"
          className="block text-sm sm:text-base font-medium text-gray-300 text-nowrap"
        >
          IPFS Code URL
        </label>
        <div className="w-full md:w-[70%] xl:w-[80%]">
          <input
            id="ipfsCodeUrl"
            value={ipfsCodeUrl}
            required
            onChange={(e) => handleCodeUrlChange(e)}
            className={`text-xs xs:text-sm sm:text-base w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none ${
              ipfsCodeUrlError ? "border-red-500" : "border-white/10"
            }`}
            placeholder="Enter IPFS URL or CID (e.g., ipfs://... or https://ipfs.io/ipfs/...)"
          />
          {ipfsCodeUrlError && (
            <p className="text-red-500 text-xs mt-1 ml-1">{ipfsCodeUrlError}</p>
          )}
          <h4 className="w-full ml-1 mt-3 text-xs text-gray-400">
            Provide an IPFS URL or CID, where your code is stored.
          </h4>
        </div>
      </div>
    </div>
  );
}
