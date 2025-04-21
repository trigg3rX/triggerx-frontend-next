import { Dialog } from "@headlessui/react";
import { FiInfo } from "react-icons/fi";
import React, { useEffect, useRef, useState } from "react";
import { Tooltip } from "antd";
import { useBalance, useAccount } from "wagmi";

export function EstimatedFeeModal({
  isOpen,
  showProcessing,
  showFees,
  setIsLoading,
  steps,
  onClose,
  estimatedFee,
  userBalance,
  onStake,
}) {
  const { address } = useAccount();
  const { data: ethBalance } = useBalance({
    address,
  });

  const hasEnoughBalance = userBalance >= estimatedFee;
  const requiredEth = (0.001 * estimatedFee).toFixed(6);
  const hasEnoughEthToStake =
    ethBalance && Number(ethBalance.formatted) >= Number(requiredEth);
  const [showRequiredTGTooltip, setShowRequiredTGTooltip] = useState(false);
  const [showBalanceTooltip, setShowBalanceTooltip] = useState(false);
  const [showStakeTooltip, setShowStakeTooltip] = useState(false);

  const [currentStep, setCurrentStep] = useState(0);
  const canvasRef = useRef(null);
  const [character, setCharacter] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0);

  const gridSize = 17;
  const tileSize = 28;

  const [foodEatenAnimation, setFoodEatenAnimation] = useState(null);

  const resetProcessing = () => {
    setCurrentStep(0);
    setGameStarted(false);
    setCharacter([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection("RIGHT");
    setGameOver(false);
    setScore(0);
  };

  useEffect(() => {
    if (
      currentStep < steps.length &&
      steps[currentStep].status === "completed"
    ) {
      setTimeout(() => setCurrentStep((prev) => prev + 1), 10000);
    }
  }, [steps, currentStep]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const keyMap = {
        ArrowUp: "UP",
        ArrowDown: "DOWN",
        ArrowLeft: "LEFT",
        ArrowRight: "RIGHT",
      };
      if (keyMap[e.key] && !gameOver) {
        setDirection(keyMap[e.key]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameOver, gameStarted]);

  const characterFrames = [];
  for (let i = 1; i <= 10; i++) {
    const img = new Image();
    img.src = `/character/frame${i}.svg`;
    characterFrames.push(img);
  }

  const ethImage = new Image();
  ethImage.src = "/character/token.svg";

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const moveCharacter = () => {
      if (!gameStarted || gameOver) return;
      setCharacter((prevCharacter) => {
        let newCharacter = [...prevCharacter];
        let head = { ...newCharacter[0] };

        switch (direction) {
          case "UP":
            head.y -= 1;
            break;
          case "DOWN":
            head.y += 1;
            break;
          case "LEFT":
            head.x -= 1;
            break;
          case "RIGHT":
            head.x += 1;
            break;
          default:
            break;
        }

        if (
          head.x < 0 ||
          head.x >= gridSize ||
          head.y < 0 ||
          head.y >= gridSize
        ) {
          setGameOver(true);
          return prevCharacter;
        }

        newCharacter.unshift(head);

        if (head.x === food.x && head.y === food.y) {
          setScore((prev) => prev + 0.5);
          setFood({
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize),
          });
          setFoodEatenAnimation({ x: food.x, y: food.y });
          setTimeout(() => setFoodEatenAnimation(null), 500);
        } else {
          newCharacter.pop();
        }

        return newCharacter;
      });
      setFrameIndex((prev) => (prev + 1) % 10);
    };

    const gameLoop = setInterval(moveCharacter, 200);
    return () => clearInterval(gameLoop);
  }, [direction, food, gameOver, gameStarted]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const currentFrame = characterFrames[frameIndex];
    character.forEach((segment) => {
      ctx.save();
      ctx.translate(
        segment.x * tileSize + tileSize / 2,
        segment.y * tileSize + tileSize / 2
      );

      if (direction === "LEFT") {
        ctx.scale(-1, 1);
      }

      ctx.drawImage(
        currentFrame,
        direction === "LEFT" ? -tileSize / 2 : -tileSize / 2,
        -tileSize / 2,
        tileSize,
        tileSize
      );

      ctx.restore();
    });

    ctx.drawImage(
      ethImage,
      food.x * tileSize,
      food.y * tileSize,
      tileSize,
      tileSize
    );

    if (foodEatenAnimation) {
      ctx.fillStyle = "white";
      ctx.font = "20px Arial";
      ctx.fillText(
        "+1",
        foodEatenAnimation.x * tileSize + tileSize / 4,
        foodEatenAnimation.y * tileSize + tileSize / 1.5
      );
    }

    if (!gameStarted) {
      ctx.fillStyle = "yellow";
      ctx.font = "18px Arial";
      ctx.fillText(
        "Fee-ding time! Tap to start the token tango",
        canvas.width / 6 - 10,
        canvas.height / 3 + 30
      );
      ctx.fillText(
        "while we calculate your job fees.",
        canvas.width / 6 + 30,
        canvas.height / 3 + 60
      );
      ctx.fillText(
        "Use arrow keys to feast!🍀",
        canvas.width / 3 - 30,
        canvas.height / 3 + 100
      );
    }

    if (gameOver) {
      ctx.fillStyle = "yellow";
      ctx.font = "20px Arial";
      ctx.fillText(
        "Fee-ding frenzy finished!",
        canvas.width / 4 + 30,
        canvas.height / 3 + 30
      );
      ctx.fillText(
        "Still brewing up your job fees... almost there!🍀⌛",
        canvas.width / 10 - 30,
        canvas.height / 3 + 60
      );
      ctx.fillText(
        `Score: ${score}`,
        canvas.width / 3 + 50,
        canvas.height / 2 + 30
      );
      ctx.fillText(
        "Tap to Restart",
        canvas.width / 3 + 20,
        canvas.height / 2 + 60
      );
    }
  }, [character, food, isOpen, gameOver, gameStarted, score, frameIndex, characterFrames, ethImage, direction, foodEatenAnimation]);

  useEffect(() => {
    if (isOpen) {
      resetProcessing();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleCanvasClick = () => {
    if (!gameStarted || gameOver) {
      setGameStarted(true);
      setCharacter([{ x: 10, y: 10 }]);
      setFood({ x: 15, y: 15 });
      setDirection("RIGHT");
      setGameOver(false);
      setScore(0);
    }
  };
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  const handleClose = () => {
    resetProcessing();
    document.body.style.overflow = "unset";
    onClose();
  };

  const handleStake = () => {
    resetProcessing();
    document.body.style.overflow = "unset";
    onStake();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      className="relative z-[10000]"
    >
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center z-[10000]">
        <Dialog.Panel className="bg-[#141414] p-8 rounded-2xl border border-white/10 backdrop-blur-xl w-full max-w-md">
          {showProcessing && !showFees && (
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white text-xl text-center">Creating Job</h3>

              <div>
                {currentStep < steps.length && (
                  <div
                    key={steps[currentStep].id}
                    className="transition-all duration-700 ease-in-out animate-pulse"
                  >
                    <h4 className="text-md">{steps[currentStep].text}</h4>
                  </div>
                )}
                {currentStep >= steps.length && (
                  <div
                    key={steps[steps.length - 1].id}
                    className="transition-all duration-700 ease-in-out animate-pulse"
                  >
                    <h4 className="text-md">{steps[steps.length - 1].text}</h4>
                  </div>
                )}

                <div className="h-1.5 bg-gray-500 opacity-50 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-[#F8FF7C] transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {(showProcessing || showFees) && (
            <>
              <div className="w-full bg-black rounded-xl flex flex-col gap-2 shadow-lg border border-gray-600 ">
              {!(showFees && gameOver) ? (
                <>
                  <canvas
                    ref={canvasRef}
                    width={gridSize * tileSize}
                    height={gridSize * tileSize}
                    onClick={handleCanvasClick}
                  />
                </>
              ) : (
                <div className="text-white text-center py-6 px-6">
                  {score > 0 ? "Fees calculated! Your token-grabbing skills have been noted.😉" : "Fees calculated! Your token-grabbing skills have been noted.😉"}
                </div>
              )}
              </div>
              <div className="text-white text-center py-2">Score: {score}</div>
            </>
          )}

          {showFees && (
            <>
              <h2 className="text-2xl font-bold my-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-white text-center">
                Estimated Fee
              </h2>
              <div className="space-y-4 mb-6">
                <div className="text-gray-300 flex justify-between">
                  <div className="flex">
                    Required TG
                    <div className="relative top-[4px]">
                      <FiInfo
                        className="text-gray-400 hover:text-white cursor-pointer ml-2"
                        size={15}
                        onMouseEnter={() => setShowRequiredTGTooltip(true)}
                        onMouseLeave={() => setShowRequiredTGTooltip(false)}
                      />
                      {showRequiredTGTooltip && (
                        <div className="absolute right-0 mt-2 p-4 bg-[#181818] rounded-xl border border-[#4B4A4A] shadow-lg z-50 w-[280px]">
                          <div className="flex flex-col gap-2 text-sm text-gray-300">
                            <div className="flex items-center gap-2">
                              <span>
                                TriggerGas (TG) is the standard unit for calculating
                                computational and resource costs in the TriggerX
                                platform.
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <p>
                    {" "}
                    {estimatedFee && estimatedFee > 0
                      ? ` ${estimatedFee.toFixed(4)} TG`
                      : "Something went wrong"}
                  </p>
                </div>

                <div className="text-gray-300 flex justify-between">
                  <p className="flex">Your TG Balance</p>
                  <Tooltip title={userBalance || "0"} placement="top">
                    <p className="cursor-help">
                      {userBalance ? Number(userBalance).toFixed(6) : "0.0000"}{" "}
                    </p>
                  </Tooltip>
                </div>

                {!hasEnoughBalance && (
                  <div className="text-gray-300 flex justify-between">
                    <div className="flex">
                      {" "}
                      Required ETH to stake
                      <div className="relative top-[4px]">
                        <FiInfo
                          className="text-gray-400 hover:text-white cursor-pointer ml-2"
                          size={15}
                          onMouseEnter={() => setShowStakeTooltip(true)}
                          onMouseLeave={() => setShowStakeTooltip(false)}
                        />
                        {showStakeTooltip && (
                          <div className="absolute right-0 mt-2 p-4 bg-[#181818] rounded-xl border border-[#4B4A4A] shadow-lg z-50 w-[280px]">
                            <div className="flex flex-col gap-2 text-sm text-gray-300">
                              <div className="flex items-center gap-2">
                                <span>
                                  Required ETH to Stake is based on the total
                                  TriggerGas consumed and TriggerGas's unit price.
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <p> {(0.001 * estimatedFee).toFixed(6)} ETH </p>
                  </div>
                )}
              </div>
              <div className="flex gap-4">
                {hasEnoughBalance ? (
                  <button
                    onClick={handleStake}
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                      !estimatedFee || estimatedFee <= 0
                        ? "bg-gray-400 text-gray-700"
                        : "bg-white text-black"
                    }`}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleStake}
                    disabled={!hasEnoughEthToStake}
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                      !hasEnoughEthToStake
                        ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                        : "bg-white text-black"
                    }`}
                  >
                    {hasEnoughEthToStake ? "Stake ETH" : "Insufficient ETH"}
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="flex-1 px-6 py-3 bg-white/10 rounded-lg font-semibold hover:bg-white/20 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
