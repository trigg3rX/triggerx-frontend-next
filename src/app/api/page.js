'use client'

import React, { useState } from "react";
import { FiCopy, FiCheck } from "react-icons/fi";
import { useAccount } from "wagmi";
import Layout from "@/components/layout/Layout";

const ApiCreation = () => {
  const [activeTab, setActiveTab] = useState("apikey");
  const [expandedSection, setExpandedSection] = useState("createautomationjob");
  const [selectedApi, setSelectedApi] = useState(null);
  const [copiedEndpoint, setCopiedEndpoint] = useState(false);
  const { isConnected, address } = useAccount(); // Add address from useAccount
  const [activeLanguage, setActiveLanguage] = useState("cURL");
  const [activeStatus, setActiveStatus] = useState("200");
  const [apiKeys, setApiKeys] = useState([
    {
      key: "No API key generated yet",
      created: "-",
      rateLimit: "20 requests/min",
      status: "Inactive",
    },
  ]);

  const generateNewApiKey = async () => {
    try {
      const user = process.env.NEXT_PUBLIC_USER;
      if (!user) {
        console.error("Owner is not defined in environment variables");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/${user}/api-keys`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            owner: address, // 使用钱包地址作为 owner
            rateLimit: 20,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      const newApiKey = {
        key: data.key || data.apiKey || "",
        created: new Date().toLocaleString(),
        rateLimit: "20 requests/min",
        status: "Active",
      };

      setApiKeys([newApiKey]);
    } catch (error) {
      console.error("Error generating API key:", error);
    }
  };

  const QuickStartGuide = () => (
    <div className="bg-[#141414] rounded-lg mb-8  border border-[#4B4A4A]">
      <div className="p-8 ">
        <h2 className="text-xl font-semibold mb-4">Quick Start Guide</h2>
        <ol className="space-y-4">
          <li className="flex flex-row gap-5 items-center">
            <span className="border border-[#C07AF6] bg-[#C07AF638] w-10 h-10 flex items-center justify-center rounded-lg">
              {" "}
              1
            </span>
            <span className="text-md">
              Generate an API key in the "API Key Generator" tab
            </span>
          </li>
          <li className="flex flex-row gap-5 items-center">
            <span className="border border-[#C07AF6] bg-[#C07AF638] w-10 h-10 flex items-center justify-center rounded-lg">
              2
            </span>
            <span className="text-md">
              Review the API documentation for available endpoints
            </span>
          </li>
          <li className="flex flex-row gap-5 items-center">
            <span className="border border-[#C07AF6] bg-[#C07AF638] w-10 h-10 flex items-center justify-center rounded-lg">
              {" "}
              3
            </span>
            <span className="text-md">
              Make API requests using your generated key
            </span>
          </li>
          <li className="flex flex-row gap-5 items-center">
            <span className="border border-[#C07AF6] bg-[#C07AF638] w-10 h-10 flex items-center justify-center rounded-lg">
              {" "}
              4
            </span>
            <span className="text-md">Monitor your usage and rate limits</span>
          </li>
        </ol>
      </div>
      <div className="mt-6 bg-[#313131] p-5 rounded-bl-md rounded-br-md">
        <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
        <p>
          If you have any questions or need assistance, please don't hesitate to
          contact our support team at{" "}
          <a className="underline">hello@triggerx.network</a>
        </p>
      </div>
    </div>
  );

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(true);
    setTimeout(() => setCopiedEndpoint(false), 2000); // Reset after 2 seconds
  };

  return (
    <Layout>
    <div className="min-h-screen md:mt-[20rem] mt-[10rem]">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center px-4">
        API Documentation & Key Management
      </h1>

      <div className="max-w-[1600px] w-[95%] sm:w-[85%] mx-auto flex justify-between items-center my-8 sm:my-12 bg-[#181818F0] p-2 rounded-lg">
        <button
          className={`w-[50%] text-[#FFFFFF] font-bold md:text-lg xs:text-sm p-4 rounded-lg ${
            activeTab === "documetation"
              ? "bg-gradient-to-r from-[#D9D9D924] to-[#14131324] border border-[#4B4A4A]"
              : "bg-transparent"
          }`}
          onClick={() => setActiveTab("documetation")}
        >
          Documentation
        </button>
        <button
          className={`w-[50%] text-[#FFFFFF] font-bold md:text-lg xs:text-sm p-4 rounded-lg ${
            activeTab === "apikey"
              ? "bg-gradient-to-r from-[#D9D9D924] to-[#14131324] border border-[#4B4A4A]"
              : "bg-transparent"
          }`}
          onClick={() => setActiveTab("apikey")}
        >
          API key Generator
        </button>
      </div>

      <div className="max-w-[1600px] mx-auto w-[95%] sm:w-[85%] px-3 sm:px-5 rounded-lg">
        {activeTab === "apikey" ? (
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 w-full justify-between ">
            {apiKeys.map((apiKey, index) => (
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 w-full justify-between ">
                <div
                  key={index}
                  className="bg-[#181818] p-6 rounded-lg mb-4 flex-1 h-[350px]  border border-[#4B4A4A]"
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-[#FBF197] text-center">
                    Generate API Key
                  </h2>
                  {!isConnected ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <p className="text-gray-400 mb-4">
                        Please connect your wallet to generate and manage API
                        keys
                      </p>
                    </div>
                  ) : (
                    <>
                      <div>
                        <button
                          className="relative bg-[#222222] text-[#000000] border border-[#222222] px-6 py-2 my-8 sm:px-8 sm:py-3 rounded-full group transition-transform w-full"
                          onClick={generateNewApiKey}
                        >
                          <span className="absolute inset-0 bg-[#222222] border border-[#FFFFFF80]/50 rounded-lg scale-100 translate-y-0 transition-all duration-300 ease-out group-hover:translate-y-2"></span>
                          <span className="absolute inset-0 bg-[#FFFFFF] rounded-lg scale-100 translate-y-0 group-hover:translate-y-0"></span>
                          <span className="font-actayRegular relative z-10 px-0 py-3 sm:px-3 md:px-6 lg:px-2 rounded-lg translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out text-xs lg:text-sm xl:text-base">
                            Generate New API Key
                          </span>
                        </button>
                        <div className="flex items-center gap-4 mb-6 bg-[#242424] rounded-lg ">
                          <input
                            type="text"
                            value={apiKey.key}
                            readOnly
                            className="flex-1  bg-[#242424]  p-3  text-sm rounded"
                          />
                          <button
                            onClick={() => copyToClipboard(apiKey.key)}
                            className={`p-2 rounded text-gray-400 hover:text-white transition-colors ${
                              copiedEndpoint ? "text-green-500" : ""
                            }`}
                          >
                            {copiedEndpoint ? (
                              <FiCheck size={20} />
                            ) : (
                              <FiCopy size={20} />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-6">
                        <div>
                          <p className="text-gray-400 mb-2">Created</p>
                          <p className="text-white">{apiKey.created}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-2">Rate Limit</p>
                          <p className="text-white">{apiKey.rateLimit}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-2">Status</p>
                          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                            {apiKey.status}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
            <div className="w-full lg:w-[700px]">
              <QuickStartGuide />
            </div>
          </div>
        ) : (
          <div className="text-white ">
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 bg-[#141414] p-4 sm:p-4  border border-[#4B4A4A] rounded-xl">
              <div className="flex-1 space-y-4 ">
                <div className="mb-8">
                  <div className="flex flex-col sm:flex-col items-start sm:items-start justify-between gap-2 p-4">
                    {" "}
                    <h2 className="text-2xl sm:text-3xl font-bold">
                      API Documentation
                    </h2>
                    <p className="mt-5 text-gray-400">
                      Explore and integrate with our Concentration Power Index
                      (CPI) calculation APIs.
                    </p>
                  </div>
                </div>
                {/* Get Calculated CPI Value */}
                <div
                  className="max-h-[500px] overflow-y-auto space-y-4"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  <div className=" flex-1 space-y-4  p-4 rounded-xl">
                    {activeTab === "documetation" && (
                     <div className="px-2 sm:px-0">
                         <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
                          {/* Column 1: API List */}
                          <div className="w-full lg:w-[30%] py-2 lg:py-4 lg:sticky top-0 h-fit">
                            <h3 className="text-xl font-bold mb-2 lg:mb-4">
                              Present APIs
                            </h3>
                            <div className="space-y-1 lg:space-y-2">
                              {[
                                {
                                  name: "Create Automation Job",
                                  method: "POST",
                                },
                                { name: "Retrieve Job Data", method: "GET" },
                               
                                {
                                  name: "Job Last Executed Time API",
                                  method: "PUT",
                                },
                                {
                                  name: "Get Jobs By User address API",
                                  method: "GET",
                                },
                                {
                                  name: "Delete Job API",
                                  method: "PUT",
                                },
                                { name: "Get User API", method: "GET" },
                              ].map((api) => (
                                <button
                                key={api.name}
                                className={`w-full text-left p-2 lg:p-3 rounded-lg transition-colors ${
                                  expandedSection ===
                                  api.name.toLowerCase().replace(/\s+/g, "")
                                    ? "bg-[#242424] "
                                    : "hover:bg-[#242424]"
                                }`}
                                onClick={() =>
                                  setExpandedSection(
                                    api.name.toLowerCase().replace(/\s+/g, "")
                                  )
                                }
                              >
                                   <div className="flex items-center justify-start gap-2 lg:gap-5">
                                    <span
                                      className={`px-2 py-1 rounded-full text-[10px] lg:text-xs text-center min-w-[50px] lg:min-w-[60px] ${
                                        api.method === "GET"
                                          ? "bg-blue-500"
                                          : api.method === "POST"
                                            ? "bg-green-500"
                                            : api.method === "PUT"
                                              ? "bg-yellow-500"
                                              : "bg-red-500"
                                      }`}
                                    >
                                      {api.method}
                                    </span>
                                    <span className="text-xs lg:text-sm">{api.name}</span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Column 2: API Details */}
                          {/* {create job api} */}
                          <div className="w-full lg:w-[70%] space-y-4">
                            {expandedSection === "createautomationjob" && (
                              <div className="space-y-6 ">
                                <div className="">
                                  <h3 className="text-xl font-bold pb-4">
                                    Create Automation Job
                                  </h3>
                                  <p className=" text-gray-400 text-md">
                                  Creates a new blockchain automation job with specified parameters. Define trigger conditions, target actions, security levels, and scheduling options. Supports both one-time and recurring executions with customizable time intervals.
                                  </p>
                                </div>

                                <div>
                                  <div className="flex items-center gap-2 bg-[#242424] rounded-md">
                                    <code className="flex-1 p-3 rounded-lg text-sm  overflow-auto ">
                                      <span className="px-3 py-2 bg-green-500 text-xs rounded-full mr-3 ">
                                        POST
                                      </span>
                                      https://data.triggerx.network/api/jobs
                                    </code>
                                    <button
                                      onClick={() =>
                                        copyToClipboard(
                                          "https://data.triggerx.network/api/jobs"
                                        )
                                      }
                                      className="p-2 rounded text-gray-400 hover:text-white transition-colors"
                                    >
                                      {copiedEndpoint ? (
                                        <FiCheck size={20} />
                                      ) : (
                                        <FiCopy size={20} />
                                      )}
                                    </button>
                                  </div>
                                </div>
                                {/* Headers Section */}
                                <div>
                                  <h4 className="text-md  mb-2">Headers</h4>
                                  <div className="bg-[#242424] p-3 rounded-lg">
                                    <table className="w-full text-sm">
                                      <tbody>
                                        <tr>
                                          <td className="py-2 text-gray-400 w-1/3">
                                            TriggerX-Api-Key
                                          </td>
                                          <td className="text-[#C3E88D] ">
                                            string
                                          </td>
                                          <td className="text-red-400 pl-4">
                                            required
                                          </td>
                                        </tr>
                                        <tr >
                                          <td className="py-2 text-gray-400">
                                            Content-Type
                                          </td>
                                          <td className="text-[#C3E88D]  ">
                                            application/json
                                          </td>
                                          <td className="text-red-400 pl-4">
                                            required
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>

                                {/* Query Parameters */}
                                {/* <div>
                                  <h4 className="text-md mb-2  border-[#4B4A4A] border-b pb-4 mb-4 ">
                                    Query Parameters
                                  </h4>
                                  <div className=" rounded-lg space-y-6">
                                    <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[#FF616D]">
                                          stake_amount
                                        </span>
                                        <span className="text-[#C3E88D]">
                                          boolean
                                        </span>
                                      </div>
                                      <p className="text-gray-400 text-sm">
                                        Enable partial results if query is too
                                        large
                                      </p>
                                    </div>

                                    <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[#FF616D]">
                                          token_amount
                                        </span>
                                        <span className="text-[#C3E88D]">
                                          string
                                        </span>
                                      </div>
                                      <p className="text-gray-400 text-sm">
                                        Comma-separated list of columns to
                                        return
                                      </p>
                                    </div>

                                    <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[#FF616D]">
                                          time_interval
                                        </span>
                                        <span className="text-[#C3E88D]">
                                          string
                                        </span>
                                      </div>
                                      <p className="text-gray-400 text-sm">
                                        Comma-separated list of columns to
                                        return
                                      </p>
                                    </div>

                                    <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[#FF616D]">
                                          priority
                                        </span>
                                        <span className="text-[#C3E88D]">
                                          string
                                        </span>
                                      </div>
                                      <p className="text-gray-400 text-sm">
                                        Comma-separated list of columns to
                                        return
                                      </p>
                                    </div>

                                    <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[#FF616D]">
                                          security
                                        </span>
                                        <span className="text-[#C3E88D]">
                                          string
                                        </span>
                                      </div>
                                      <p className="text-gray-400 text-sm">
                                        Comma-separated list of columns to
                                        return
                                      </p>
                                    </div>

                                    <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[#FF616D]">
                                          trigger_event
                                        </span>
                                        <span className="text-[#C3E88D]">
                                          string
                                        </span>
                                      </div>
                                      <p className="text-gray-400 text-sm">
                                        Comma-separated list of columns to
                                        return
                                      </p>
                                    </div>

                                    <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[#FF616D]">
                                          job_cost_prediction
                                        </span>
                                        <span className="text-[#C3E88D]">
                                          string
                                        </span>
                                      </div>
                                      <p className="text-gray-400 text-sm">
                                        Comma-separated list of columns to
                                        return
                                      </p>
                                    </div>
                                  </div>
                                </div> */}

                                  {/* Query Parameters */}
                                  <div>
                                  <h4 className="text-md mb-2  border-[#4B4A4A] border-b pb-4 mb-4 ">
                                    Query Parameters
                                  </h4>
                                  <div className=" rounded-lg space-y-6">
                                    <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[#FF616D]">
                                        api_key 
                                        </span>
                                        <span className="text-[#C3E88D]">
                                          string
                                        </span>
                                      </div>
                                      <p className="text-gray-400 text-sm">
                                      Alternative to using the X-Api-Key header for authentication
                                      </p>
                                    </div>
                                  </div>
                                  <div className=" rounded-lg space-y-6">
                                    <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[#FF616D]">
                                        columns  
                                        </span>
                                        <span className="text-[#C3E88D]">
                                          string
                                        </span>
                                      </div>
                                      <p className="text-gray-400 text-sm">
                                      Comma-separated list of column names to return specific fields
                                      </p>
                                    </div>
                                  </div>
                                  <div className=" rounded-lg space-y-6">
                                    <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[#FF616D]">
                                        filters   
                                        </span>
                                        <span className="text-[#C3E88D]">
                                          string
                                        </span>
                                      </div>
                                      <p className="text-gray-400 text-sm">
                                      SQL-like WHERE clause to filter results
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Response Section */}
                                <div>
                                  <div className="flex items-center gap-2 justify-between my-5  border-[#4B4A4A] border-b pb-4 mb-4">
                                    <div>
                                      <h4 className="text-md ">Response</h4>
                                    </div>
                                    <div className="flex items-center gap-3 ">
                                      <select
                                        value={activeStatus}
                                        onChange={(e) =>
                                          setActiveStatus(e.target.value)
                                        }
                                        className="bg-[#1A1A1A] text-gray-400 px-3 py-2 rounded-md border border-[#333333] focus:outline-none focus:border-[#5047FF]"
                                      >
                                        <option value="200">200</option>
                                        <option value="400">400 </option>
                                        <option value="401">401 </option>
                                        <option value="404">404 </option>
                                        <option value="500">500 </option>
                                      </select>
                                      <span className="text-[#C3E88D] lg:block hidden">
                                        application/json
                                      </span>
                                    </div>
                                  </div>
                                  <div className="rounded-lg">
                                    <div className="">
                                      {activeStatus === "200" && (
                                        <>
                                          <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                            <div className="flex items-center gap-2 mb-1">
                                              <span className="text-[#FF616D]">
                                                account_balance
                                              </span>
                                              <span className="text-[#C3E88D]">
                                                string
                                              </span>
                                            </div>
                                            <p className="text-gray-400 text-sm">
                                              Comma-separated list of columns to
                                              return_balance
                                            </p>
                                          </div>
                                          <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                            <div className="flex items-center gap-2 mb-1">
                                              <span className="text-[#FF616D]">
                                                token_balance
                                              </span>
                                              <span className="text-[#C3E88D]">
                                                string
                                              </span>
                                            </div>
                                            <p className="text-gray-400 text-sm">
                                              Comma-separated list of columns to
                                              return
                                            </p>
                                          </div>
                                          <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                            <div className="flex items-center gap-2 mb-1">
                                              <span className="text-[#FF616D]">
                                                time_frames
                                              </span>
                                              <span className="text-[#C3E88D]">
                                                string
                                              </span>
                                            </div>
                                            <p className="text-gray-400 text-sm">
                                              Comma-separated list of columns to
                                              return
                                            </p>
                                          </div>
                                          <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                            <div className="flex items-center gap-2 mb-1">
                                              <span className="text-[#FF616D]">
                                                task_definition_ids
                                              </span>
                                              <span className="text-[#C3E88D]">
                                                string
                                              </span>
                                            </div>
                                            <p className="text-gray-400 text-sm">
                                              Comma-separated list of columns to
                                              return
                                            </p>
                                          </div>
                                        </>
                                      )}
                                      {activeStatus === "400" && (
                                        <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                          <p className="text-gray-400 mb-2">
                                            Bad Request
                                          </p>
                                          <pre className=" mb-2">
                                            Error{" "}
                                            <span className="text-[#C3E88D]">
                                              String
                                            </span>
                                          </pre>
                                          <pre className="text-sm text-red-400">
                                            <span className="text-white">
                                              Example :{" "}
                                            </span>
                                            "Invalid input data"
                                          </pre>
                                        </div>
                                      )}
                                      {activeStatus === "401" && (
                                        <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                          <p className="text-gray-400 mb-2">
                                            Unauthorized
                                          </p>
                                          <pre className=" mb-2">
                                            Error{" "}
                                            <span className="text-[#C3E88D]">
                                              String
                                            </span>
                                          </pre>
                                          <pre className="text-sm text-red-400">
                                            <span className="text-white">
                                              Example :{" "}
                                            </span>
                                            "Invalid or missing API key" "
                                          </pre>
                                        </div>
                                      )}
                                      {activeStatus === "404" && (
                                        <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                          <p className="text-gray-400 mb-2">
                                            Not Found
                                          </p>

                                          <pre className=" mb-2">
                                            Error{" "}
                                            <span className="text-[#C3E88D]">
                                              String
                                            </span>
                                          </pre>
                                          <pre className="text-sm text-red-400">
                                            <span className="text-white">
                                              Example :{" "}
                                            </span>
                                            "Resource not found"
                                          </pre>
                                        </div>
                                      )}

                                      {activeStatus === "500" && (
                                        <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                          <p className="text-gray-400 mb-2">
                                            Internal Server Error
                                          </p>
                                          <pre className=" mb-2">
                                            Error{" "}
                                            <span className="text-[#C3E88D]">
                                              String
                                            </span>
                                          </pre>
                                          <pre className="text-sm text-red-400">
                                            <span className="text-white">
                                              Example :{" "}
                                            </span>
                                            "Server-side error"
                                          </pre>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="w-full py-4">
                                  {/* Request Data Section */}
                                  <div className="bg-[#1A1A1A] rounded-lg border border-[#333333] overflow-hidden">
                                    <div className="flex items-center justify-between p-4 border-b border-[#333333]">
                                      <h3 className="text-xl font-bold">
                                        API Request
                                      </h3>
                                      <div className="flex gap-2">
                                        <span className="px-2 py-1 bg-green-500 text-xs rounded-full">
                                          POST
                                        </span>
                                      </div>
                                    </div>

                                    {/* Language Tabs */}
                                    <div className="flex border-b border-[#333333]">
                                      {["cURL"].map((lang) => (
                                        <button
                                          key={lang}
                                          onClick={() =>
                                            setActiveLanguage(`cURL`)
                                          }
                                          className={`px-4 py-2 text-sm font-medium ${
                                            activeLanguage === lang
                                              ? "bg-[#242424] text-white border-b-2 border-[#5047FF]"
                                              : "text-gray-400 hover:text-white hover:bg-[#242424]/50"
                                          }`}
                                        >
                                          {lang}
                                        </button>
                                      ))}
                                    </div>

                                    <div className="p-4 bg-[#242424]">
                                      {activeLanguage === "cURL" && (
                                        <pre
                                          className="text-sm overflow-x-auto whitespace-pre-wrap"
                                          style={{
                                            scrollbarWidth: "thin",
                                            "&::-webkit-scrollbar": {
                                              width: "4px",
                                              height: "4px",
                                            },
                                            "&::-webkit-scrollbar-track": {
                                              backgroundColor: "#1A1A1A",
                                            },
                                            "&::-webkit-scrollbar-thumb": {
                                              backgroundColor: "#333333",
                                              borderRadius: "4px",
                                            },
                                          }}
                                        >
                                          <div className="text-sm">
                                            {"{"}
                                            <div className="ml-4">
                                              <span className="text-[#FF616D]">
                                                "user_address"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                "0x..."
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "stake_amount"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                "1000000000000000000"
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "token_amount"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                "1000000000000000000"
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "task_definition_id"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                1
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "priority"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                2
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "security"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                1
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "time_frame"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                3600
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "recurring"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                true
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "time_interval"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                300
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "trigger_chain_id"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                "1"
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "trigger_contract_address"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                "0x..."
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "trigger_event"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                "Transfer"
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "script_ipfs_url"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                "ipfs://..."
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "script_trigger_function"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                "checkCondition"
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "target_chain_id"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                "1"
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "target_contract_address"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                "0x..."
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "target_function"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                "execute"
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "arg_type"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                1
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "arguments"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                ["arg1", "arg2"]
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "script_target_function"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                "executeAction"
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "job_cost_prediction"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                0.05
                                              </span>
                                            </div>
                                            {"}"}
                                          </div>
                                        </pre>
                                      )}

                                      {/* Add other language examples similarly */}
                                    </div>
                                  </div>

                                  {/* Response Section */}
                                  <div className="mt-5 bg-[#1A1A1A] rounded-lg border border-[#333333] ">
                                    <div className="flex items-center justify-between p-4 border-b border-[#333333]">
                                      <h3 className="text-xl font-bold">
                                        Response
                                      </h3>
                                    </div>

                                    {/* Status Code Tabs */}
                                    <div className="flex border-b border-[#333333] overflow-scroll md:overflow-hidden">
                                      {[
                                        { code: "200", color: "bg-green-500" },
                                        { code: "400", color: "bg-yellow-500" },
                                        { code: "401", color: "bg-red-500" },
                                        { code: "403", color: "bg-red-500" },
                                        { code: "500", color: "bg-red-500" },
                                      ].map((status) => (
                                        <button
                                          key={status.code}
                                          onClick={() =>
                                            setActiveStatus(status.code)
                                          }
                                          className={`px-4 py-2 text-sm font-medium flex items-center gap-2 ${
                                            activeStatus === status.code
                                              ? "bg-[#242424] text-white"
                                              : "text-gray-400 hover:text-white hover:bg-[#242424]/50"
                                          }`}
                                        >
                                          <span
                                            className={`w-2 h-2 rounded-full ${status.color}`}
                                          ></span>
                                          {status.code}
                                        </button>
                                      ))}
                                    </div>

                                    <div className="p-4 bg-[#242424]">
                                      {activeStatus === "200" && (
                                        <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                                          <div className="text-sm">
                                            {"{"}
                                            <div className="ml-4">
                                              <span className="text-[#FF616D]">
                                                "user_id"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                123
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "account_balance"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                "2000000000000000000"
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "token_balance"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                "1000000000000000000"
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "job_ids"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                [1, 2, 3]
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "task_definition_ids"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                [1, 2]
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "time_frames"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                [3600, 7200]
                                              </span>
                                            </div>
                                            {"}"}
                                          </div>
                                        </pre>
                                      )}
                                      {activeStatus === "400" && (
                                        <pre className="text-sm overflow-x-auto whitespace-pre-wrap text-[#E6E6E6]">
                                          {"{"}{" "}
                                          <div className="ml-4">
                                            <span className="text-[#FF616D]">
                                              "Bad Request"
                                            </span>
                                            :{" "}
                                            <span className="text-[#C3E88D]">
                                              Invalid input data
                                            </span>
                                            ,<br />
                                          </div>
                                          {"}"}
                                        </pre>
                                      )}
                                      {activeStatus === "401" && (
                                        <pre className="text-sm overflow-x-auto whitespace-pre-wrap text-[#E6E6E6]">
                                          {"{"}{" "}
                                          <div className="ml-4">
                                            <span className="text-[#FF616D]">
                                              "Unauthorized"
                                            </span>
                                            :{" "}
                                            <span className="text-[#C3E88D]">
                                              Invalid or missing API key
                                            </span>
                                            ,<br />
                                          </div>
                                          {"}"}
                                        </pre>
                                      )}
                                      {activeStatus === "403" && (
                                        <pre className="text-sm overflow-x-auto whitespace-pre-wrap text-[#E6E6E6]">
                                          {"{"}{" "}
                                          <div className="ml-4">
                                            <span className="text-[#FF616D]">
                                              "Not Found"
                                            </span>
                                            :{" "}
                                            <span className="text-[#C3E88D]">
                                              Resource not found
                                            </span>
                                            ,<br />
                                          </div>
                                          {"}"}
                                        </pre>
                                      )}
                                      {activeStatus === "500" && (
                                        <pre className="text-sm overflow-x-auto whitespace-pre-wrap text-[#E6E6E6]">
                                          {"{"}{" "}
                                          <div className="ml-4">
                                            <span className="text-[#FF616D]">
                                              "Internal Server Error"
                                            </span>
                                            :{" "}
                                            <span className="text-[#C3E88D]">
                                              Server-side error
                                            </span>
                                            ,<br />
                                          </div>
                                          {"}"}
                                        </pre>
                                      )}
                                      {/* Add other status responses similarly */}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {expandedSection === "retrievejobdata" && (
                              <div className="space-y-6 w-[80%]">
                                <div className="">
                                  <h3 className="text-xl font-bold pb-4">
                                    Retrive Job Data
                                  </h3>
                                  <p className=" text-gray-400 text-md">
                                  Fetches detailed information about a specific automation job using its unique ID. Returns comprehensive data including job status, configuration, execution history, and associated parameters.
                                  </p>
                                </div>

                                <div>
                                  <div className="flex items-center gap-2 bg-[#242424] rounded-md">
                                    <code className="flex-1 p-3 rounded-lg text-sm">
                                      <span className="px-3 py-2 bg-blue-500 text-xs rounded-full mr-3">
                                        GET
                                      </span>
                                      https://data.triggerx.network/api/jobs/
                                      <span>{"{id}"}</span>
                                    </code>
                                    <button
                                      onClick={() =>
                                        copyToClipboard(
                                          "https://data.triggerx.network/api/jobs/{id}"
                                        )
                                      }
                                      className="p-2 rounded text-gray-400 hover:text-white transition-colors"
                                    >
                                      {copiedEndpoint ? (
                                        <FiCheck size={20} />
                                      ) : (
                                        <FiCopy size={20} />
                                      )}
                                    </button>
                                  </div>
                                </div>
                                {/* Headers Section */}
                                <div>
                                  <h4 className="text-md  mb-2">Headers</h4>
                                  <div className="bg-[#242424] p-3 rounded-lg">
                                    <table className="w-full text-sm">
                                      <tbody>
                                        <tr>
                                          <td className="py-2 text-gray-400 w-1/3">
                                            TriggerX-Api-Key
                                          </td>
                                          <td className="text-[#C3E88D] ">
                                            string
                                          </td>
                                          <td className="text-red-400 pl-4">
                                            required
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="py-2 text-gray-400">
                                            Content-Type
                                          </td>
                                          <td className="text-[#C3E88D]">
                                            application/json
                                          </td>
                                          <td className="text-red-400 pl-4">
                                            required
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>

                           {/* Query Parameters */}
                           <div>
                                  <h4 className="text-md mb-2  border-[#4B4A4A] border-b pb-4 mb-4 ">
                                    Query Parameters
                                  </h4>
                                  <div className=" rounded-lg space-y-6">
                                    <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[#FF616D]">
                                        api_key 
                                        </span>
                                        <span className="text-[#C3E88D]">
                                          string
                                        </span>
                                      </div>
                                      <p className="text-gray-400 text-sm">
                                      Alternative to using the X-Api-Key header for authentication
                                      </p>
                                    </div>
                                  </div>
                                  <div className=" rounded-lg space-y-6">
                                    <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[#FF616D]">
                                        columns  
                                        </span>
                                        <span className="text-[#C3E88D]">
                                          string
                                        </span>
                                      </div>
                                      <p className="text-gray-400 text-sm">
                                      Comma-separated list of column names to return specific fields
                                      </p>
                                    </div>
                                  </div>
                                  <div className=" rounded-lg space-y-6">
                                    <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[#FF616D]">
                                        filters   
                                        </span>
                                        <span className="text-[#C3E88D]">
                                          string
                                        </span>
                                      </div>
                                      <p className="text-gray-400 text-sm">
                                      SQL-like WHERE clause to filter results
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Response Section */}
                                <div>
                                  <div className="flex items-center gap-2 justify-between my-5  border-[#4B4A4A] border-b pb-4 mb-4">
                                    <div>
                                      <h4 className="text-md ">Response</h4>
                                    </div>
                                    <div>
                                      <select
                                        value={activeStatus}
                                        onChange={(e) =>
                                          setActiveStatus(e.target.value)
                                        }
                                        className="bg-[#1A1A1A] text-gray-400 px-3 py-2 rounded-md border border-[#333333] focus:outline-none focus:border-[#5047FF]"
                                      >
                                        <option value="200">200</option>
                                        <option value="400">400 </option>
                                        <option value="401">401 </option>
                                        <option value="404">404 </option>
                                        <option value="500">500 </option>
                                      </select>
                                      <span className="text-[#C3E88D] ml-3">
                                        application/json
                                      </span>
                                    </div>
                                  </div>
                                  <div className="rounded-lg">
                                    <div className="">
                                      {activeStatus === "200" && (
                                        <>
                                          <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                            <div className="flex items-center gap-2 mb-1">
                                              <span className="text-[#FF616D]">
                                                time_frame
                                              </span>
                                              <span className="text-[#C3E88D]">
                                                string
                                              </span>
                                            </div>
                                            <p className="text-gray-400 text-sm">
                                              Comma-separated list of columns to
                                              return_balance
                                            </p>
                                          </div>
                                          <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                            <div className="flex items-center gap-2 mb-1">
                                              <span className="text-[#FF616D]">
                                                last_executed_at
                                              </span>
                                              <span className="text-[#C3E88D]">
                                                string
                                              </span>
                                            </div>
                                            <p className="text-gray-400 text-sm">
                                              Comma-separated list of columns to
                                              return
                                            </p>
                                          </div>
                                          <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                            <div className="flex items-center gap-2 mb-1">
                                              <span className="text-[#FF616D]">
                                                task_definition_id
                                              </span>
                                              <span className="text-[#C3E88D]">
                                                string
                                              </span>
                                            </div>
                                            <p className="text-gray-400 text-sm">
                                              Comma-separated list of columns to
                                              return
                                            </p>
                                          </div>
                                          <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                            <div className="flex items-center gap-2 mb-1">
                                              <span className="text-[#FF616D]">
                                                chain_status
                                              </span>
                                              <span className="text-[#C3E88D]">
                                                string
                                              </span>
                                            </div>
                                            <p className="text-gray-400 text-sm">
                                              Comma-separated list of columns to
                                              return
                                            </p>
                                          </div>
                                          <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                            <div className="flex items-center gap-2 mb-1">
                                              <span className="text-[#FF616D]">
                                                recurring
                                              </span>
                                              <span className="text-[#C3E88D]">
                                                string
                                              </span>
                                            </div>
                                            <p className="text-gray-400 text-sm">
                                              Comma-separated list of columns to
                                              return
                                            </p>
                                          </div>
                                          <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                            <div className="flex items-center gap-2 mb-1">
                                              <span className="text-[#FF616D]">
                                                job_cost_prediction
                                              </span>
                                              <span className="text-[#C3E88D]">
                                                string
                                              </span>
                                            </div>
                                            <p className="text-gray-400 text-sm">
                                              Comma-separated list of columns to
                                              return
                                            </p>
                                          </div>
                                          <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                            <div className="flex items-center gap-2 mb-1">
                                              <span className="text-[#FF616D]">
                                                created_at
                                              </span>
                                              <span className="text-[#C3E88D]">
                                                string
                                              </span>
                                            </div>
                                            <p className="text-gray-400 text-sm">
                                              Comma-separated list of columns to
                                              return
                                            </p>
                                          </div>
                                        </>
                                      )}
                                      {activeStatus === "400" && (
                                        <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                          <p className="text-gray-400 mb-2">
                                            Bad Request
                                          </p>
                                          <pre className=" mb-2">
                                            Error{" "}
                                            <span className="text-[#C3E88D]">
                                              String
                                            </span>
                                          </pre>
                                          <pre className="text-sm text-red-400">
                                            <span className="text-white">
                                              Example :{" "}
                                            </span>
                                            "Invalid input data"
                                          </pre>
                                        </div>
                                      )}
                                      {activeStatus === "401" && (
                                        <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                          <p className="text-gray-400 mb-2">
                                            Unauthorized
                                          </p>
                                          <pre className=" mb-2">
                                            Error{" "}
                                            <span className="text-[#C3E88D]">
                                              String
                                            </span>
                                          </pre>
                                          <pre className="text-sm text-red-400">
                                            <span className="text-white">
                                              Example :{" "}
                                            </span>
                                            "Invalid or missing API key" "
                                          </pre>
                                        </div>
                                      )}
                                      {activeStatus === "404" && (
                                        <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                          <p className="text-gray-400 mb-2">
                                            Not Found
                                          </p>

                                          <pre className=" mb-2">
                                            Error{" "}
                                            <span className="text-[#C3E88D]">
                                              String
                                            </span>
                                          </pre>
                                          <pre className="text-sm text-red-400">
                                            <span className="text-white">
                                              Example :{" "}
                                            </span>
                                            "Resource not found"
                                          </pre>
                                        </div>
                                      )}

                                      {activeStatus === "500" && (
                                        <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                          <p className="text-gray-400 mb-2">
                                            Internal Server Error
                                          </p>
                                          <pre className=" mb-2">
                                            Error{" "}
                                            <span className="text-[#C3E88D]">
                                              String
                                            </span>
                                          </pre>
                                          <pre className="text-sm text-red-400">
                                            <span className="text-white">
                                              Example :{" "}
                                            </span>
                                            "Server-side error"
                                          </pre>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="w-full py-4">
                                  {/* Request Data Section */}
                                  <div className="bg-[#1A1A1A] rounded-lg border border-[#333333] overflow-hidden">
                                    <div className="flex items-center justify-between p-4 border-b border-[#333333]">
                                      <h3 className="text-xl font-bold">
                                        API Request
                                      </h3>
                                      <div className="flex gap-2">
                                        <span className="px-5 py-2 bg-blue-500  text-xs rounded-full">
                                          GET
                                        </span>
                                      </div>
                                    </div>

                                    {/* Language Tabs */}
                                    <div className="flex border-b border-[#333333]">
                                      {["cURL"].map((lang) => (
                                        <button
                                          key={lang}
                                          onClick={() =>
                                            setActiveLanguage(`cURL`)
                                          }
                                          className={`px-4 py-2 text-sm font-medium ${
                                            activeLanguage === lang
                                              ? "bg-[#242424] text-white border-b-2 border-[#5047FF]"
                                              : "text-gray-400 hover:text-white hover:bg-[#242424]/50"
                                          }`}
                                        >
                                          {lang}
                                        </button>
                                      ))}
                                    </div>

                                    <div className="p-4 bg-[#242424]">
                                      {activeLanguage === "cURL" && (
                                        <pre
                                          className="text-sm overflow-x-auto whitespace-pre-wrap"
                                          style={{
                                            scrollbarWidth: "thin",
                                            "&::-webkit-scrollbar": {
                                              width: "4px",
                                              height: "4px",
                                            },
                                            "&::-webkit-scrollbar-track": {
                                              backgroundColor: "#1A1A1A",
                                            },
                                            "&::-webkit-scrollbar-thumb": {
                                              backgroundColor: "#333333",
                                              borderRadius: "4px",
                                            },
                                          }}
                                        >
                                          <div>curl --request GET \ </div>
                                          <div>
                                            {" "}
                                            --url
                                            https://data.triggerx.network/api/jobs/1
                                            \
                                          </div>
                                          <div>
                                            --header 'X-Api-Key:
                                            {"<your-api-key>"}'
                                          </div>
                                          <div>-data</div>
                                          <div className="text-sm">
                                            {"{"}
                                            <div className="ml-4">
                                              <span className="text-[#FF616D]">
                                                "api_key"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                "-"
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "allow_partial_results"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                "-"
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "columns"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                "-"
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "filters"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                -
                                              </span>
                                              ,<br />
                                            </div>
                                            {"}"}
                                          </div>
                                        </pre>
                                      )}

                                      {/* Add other language examples similarly */}
                                    </div>
                                  </div>

                                  {/* Response Section */}
                                  <div className="mt-5 bg-[#1A1A1A] rounded-lg border border-[#333333] overflow-hidden">
                                    <div className="flex items-center justify-between p-4 border-b border-[#333333]">
                                      <h3 className="text-xl font-bold">
                                        Response
                                      </h3>
                                    </div>

                                    {/* Status Code Tabs */}
                                    <div className="flex border-b border-[#333333]">
                                      {[
                                        { code: "200", color: "bg-green-500" },
                                        { code: "400", color: "bg-yellow-500" },
                                        { code: "401", color: "bg-red-500" },
                                        { code: "403", color: "bg-red-500" },
                                        { code: "500", color: "bg-red-500" },
                                      ].map((status) => (
                                        <button
                                          key={status.code}
                                          onClick={() =>
                                            setActiveStatus(status.code)
                                          }
                                          className={`px-4 py-2 text-sm font-medium flex items-center gap-2 ${
                                            activeStatus === status.code
                                              ? "bg-[#242424] text-white"
                                              : "text-gray-400 hover:text-white hover:bg-[#242424]/50"
                                          }`}
                                        >
                                          <span
                                            className={`w-2 h-2 rounded-full ${status.color}`}
                                          ></span>
                                          {status.code}
                                        </button>
                                      ))}
                                    </div>

                                    <div className="p-4 bg-[#242424]">
                                      {activeStatus === "200" && (
                                        <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                                          <div className="text-sm">
                                            {"{"}
                                            <div className="ml-4">
                                              <span className="text-[#FF616D]">
                                                "job_id"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                "1"
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "task_definition_id"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                "1"
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "user_id"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                "123"
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "link_job_id"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                456
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "priority"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                2
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "security"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                1
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "chain_status"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                0
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "recurring"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                true
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "job_cost_prediction"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                0.05
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "time_frame"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                "3600"
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "created_at"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                "2024-03-20T10:00:00Z"
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "last_executed_at"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                "2024-03-20T11:00:00Z"
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "task_ids"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                "[1, 2, 3]"
                                              </span>
                                            </div>
                                            {"}"}
                                          </div>
                                        </pre>
                                      )}
                                      {activeStatus === "400" && (
                                        <pre className="text-sm overflow-x-auto whitespace-pre-wrap text-[#E6E6E6]">
                                          {"{"}{" "}
                                          <div className="ml-4">
                                            <span className="text-[#FF616D]">
                                              "Bad Request"
                                            </span>
                                            :{" "}
                                            <span className="text-[#C3E88D]">
                                              Invalid input data
                                            </span>
                                            ,<br />
                                          </div>
                                          {"}"}
                                        </pre>
                                      )}
                                      {activeStatus === "401" && (
                                        <pre className="text-sm overflow-x-auto whitespace-pre-wrap text-[#E6E6E6]">
                                          {"{"}{" "}
                                          <div className="ml-4">
                                            <span className="text-[#FF616D]">
                                              "Unauthorized"
                                            </span>
                                            :{" "}
                                            <span className="text-[#C3E88D]">
                                              Invalid or missing API key
                                            </span>
                                            ,<br />
                                          </div>
                                          {"}"}
                                        </pre>
                                      )}
                                      {activeStatus === "403" && (
                                        <pre className="text-sm overflow-x-auto whitespace-pre-wrap text-[#E6E6E6]">
                                          {"{"}{" "}
                                          <div className="ml-4">
                                            <span className="text-[#FF616D]">
                                              "Not Found"
                                            </span>
                                            :{" "}
                                            <span className="text-[#C3E88D]">
                                              Resource not found
                                            </span>
                                            ,<br />
                                          </div>
                                          {"}"}
                                        </pre>
                                      )}
                                      {activeStatus === "500" && (
                                        <pre className="text-sm overflow-x-auto whitespace-pre-wrap text-[#E6E6E6]">
                                          {"{"}{" "}
                                          <div className="ml-4">
                                            <span className="text-[#FF616D]">
                                              "Internal Server Error"
                                            </span>
                                            :{" "}
                                            <span className="text-[#C3E88D]">
                                              Server-side error
                                            </span>
                                            ,<br />
                                          </div>
                                          {"}"}
                                        </pre>
                                      )}
                                      {/* Add other status responses similarly */}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                           
                            {expandedSection === "joblastexecutedtimeapi" && (
                              <div className="space-y-6 w-[80%]">
                                <div className="">
                                  <h3 className="text-xl font-bold pb-4">
                                    Job Last Executed Time API
                                  </h3>
                                  <p className=" text-gray-400 text-md">
                                  Updates the last execution timestamp for a specific automation job. This is used to track when the job was last run and manage scheduling for recurring tasks.
                                  </p>
                                </div>

                                <div>
                                  <div className="flex items-center gap-2 bg-[#242424] rounded-md">
                                    <code className="flex-1 p-3 rounded-lg text-sm">
                                      <span className="px-3 py-2 bg-green-500 text-xs rounded-full mr-3">
                                        PUT
                                      </span>
                                      https://data.triggerx.network/api/jobs/
                                      <span>{"{id}"}</span>/lastexecuted
                                    </code>
                                    <button
                                      onClick={() =>
                                        copyToClipboard(
                                          "https://data.triggerx.network/api/jobs/{id}/lastexecuted"
                                        )
                                      }
                                      className="p-2 rounded text-gray-400 hover:text-white transition-colors"
                                    >
                                      {copiedEndpoint ? (
                                        <FiCheck size={20} />
                                      ) : (
                                        <FiCopy size={20} />
                                      )}
                                    </button>
                                  </div>
                                </div>
                                {/* Headers Section */}
                                <div>
                                  <h4 className="text-md  mb-2">Headers</h4>
                                  <div className="bg-[#242424] p-3 rounded-lg">
                                    <table className="w-full text-sm">
                                      <tbody>
                                        <tr>
                                          <td className="py-2 text-gray-400 w-1/3">
                                            TriggerX-Api-Key
                                          </td>
                                          <td className="text-[#C3E88D]">
                                            string
                                          </td>
                                          <td className="text-red-400 pl-4">
                                            required
                                          </td>
                                        </tr>
                                        <tr >
                                          <td className="py-2 text-gray-400">
                                            Content-Type
                                          </td>
                                          <td className="text-[#C3E88D]  ">
                                            application/json
                                          </td>
                                          <td className="text-red-400 pl-4">
                                            required
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>

                                {/* Query Parameters */}
                                {/* <div>
                                  <h4 className="text-md mb-2  border-[#4B4A4A] border-b pb-4 mb-4 ">
                                    Query Parameters
                                  </h4>
                                  <div className=" rounded-lg space-y-6">
                                    <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[#FF616D]">
                                          job_id
                                        </span>
                                        <span className="text-[#C3E88D]">
                                          string
                                        </span>
                                      </div>
                                      <p className="text-gray-400 text-sm">
                                        Alternative to using the X-Api-Key
                                        header
                                      </p>
                                    </div>

                                    <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[#FF616D]">
                                          recurring
                                        </span>
                                        <span className="text-[#C3E88D]">
                                          boolean
                                        </span>
                                      </div>
                                      <p className="text-gray-400 text-sm">
                                        Enable returning partial results for
                                        large queries
                                      </p>
                                    </div>

                                    <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[#FF616D]">
                                          time_frame
                                        </span>
                                        <span className="text-[#C3E88D]">
                                          string
                                        </span>
                                      </div>
                                      <p className="text-gray-400 text-sm">
                                        Comma-separated list of column names to
                                        return (e.g., "job_id,status,priority")
                                      </p>
                                    </div>
                                  </div>
                                </div> */}
  {/* Query Parameters */}
  <div>
                                  <h4 className="text-md mb-2  border-[#4B4A4A] border-b pb-4 mb-4 ">
                                    Query Parameters
                                  </h4>
                                  <div className=" rounded-lg space-y-6">
                                    <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[#FF616D]">
                                        api_key 
                                        </span>
                                        <span className="text-[#C3E88D]">
                                          string
                                        </span>
                                      </div>
                                      <p className="text-gray-400 text-sm">
                                      Alternative to using the X-Api-Key header for authentication
                                      </p>
                                    </div>
                                  </div>
                                  <div className=" rounded-lg space-y-6">
                                    <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[#FF616D]">
                                        columns  
                                        </span>
                                        <span className="text-[#C3E88D]">
                                          string
                                        </span>
                                      </div>
                                      <p className="text-gray-400 text-sm">
                                      Comma-separated list of column names to return specific fields
                                      </p>
                                    </div>
                                  </div>
                                  <div className=" rounded-lg space-y-6">
                                    <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[#FF616D]">
                                        filters   
                                        </span>
                                        <span className="text-[#C3E88D]">
                                          string
                                        </span>
                                      </div>
                                      <p className="text-gray-400 text-sm">
                                      SQL-like WHERE clause to filter results
                                      </p>
                                    </div>
                                  </div>
                                </div>
                               
                                <div className="w-full py-4">
                                  {/* Request Data Section */}
                                  <div className="bg-[#1A1A1A] rounded-lg border border-[#333333] overflow-hidden">
                                    <div className="flex items-center justify-between p-4 border-b border-[#333333]">
                                      <h3 className="text-xl font-bold">
                                        API Request
                                      </h3>
                                      <div className="flex gap-2">
                                        <span className="px-5 py-2 bg-blue-500  text-xs rounded-full">
                                          GET
                                        </span>
                                      </div>
                                    </div>

                                    {/* Language Tabs */}
                                    <div className="flex border-b border-[#333333]">
                                      {["cURL"].map((lang) => (
                                        <button
                                          key={lang}
                                          onClick={() =>
                                            setActiveLanguage(`cURL`)
                                          }
                                          className={`px-4 py-2 text-sm font-medium ${
                                            activeLanguage === lang
                                              ? "bg-[#242424] text-white border-b-2 border-[#5047FF]"
                                              : "text-gray-400 hover:text-white hover:bg-[#242424]/50"
                                          }`}
                                        >
                                          {lang}
                                        </button>
                                      ))}
                                    </div>

                                    <div className="p-4 bg-[#242424]">
                                      {activeLanguage === "cURL" && (
                                        <pre
                                          className="text-sm overflow-x-auto whitespace-pre-wrap"
                                          style={{
                                            scrollbarWidth: "thin",
                                            "&::-webkit-scrollbar": {
                                              width: "4px",
                                              height: "4px",
                                            },
                                            "&::-webkit-scrollbar-track": {
                                              backgroundColor: "#1A1A1A",
                                            },
                                            "&::-webkit-scrollbar-thumb": {
                                              backgroundColor: "#333333",
                                              borderRadius: "4px",
                                            },
                                          }}
                                        >
                                          <div>curl --request PUT \ </div>
                                          <div>
                                            {" "}
                                            --url
                                            https://data.triggerx.network/api/jobs/123/lastexecuted
                                            \
                                          </div>
                                          <div>
                                            --header 'X-Api-Key:
                                            {"<your-api-key>"}'
                                          </div>
                                          <div>
                                            --header 'Content-Type:
                                            application/json' \
                                          </div>
                                          <div>--data</div>
                                          <div className="text-sm">
                                            {"{"}
                                            <div className="ml-4">
                                              <span className="text-[#FF616D]">
                                                "job_id"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                "123"
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "recurring"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                "false"
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "time_frame"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                "7200"
                                              </span>
                                              ,<br />
                                            </div>
                                            {"}"}
                                          </div>
                                        </pre>
                                      )}

                                      {/* Add other language examples similarly */}
                                    </div>
                                  </div>

                                  {/* Response Section */}
                                  <div className="mt-5 bg-[#1A1A1A] rounded-lg border border-[#333333] overflow-hidden">
                                    <div className="flex items-center justify-between p-4 border-b border-[#333333]">
                                      <h3 className="text-xl font-bold">
                                        Response
                                      </h3>
                                    </div>

                                    {/* Status Code Tabs */}
                                    <div className="flex border-b border-[#333333]">
                                      {[
                                        { code: "200", color: "bg-green-500" },
                                        { code: "400", color: "bg-yellow-500" },
                                        { code: "401", color: "bg-red-500" },
                                        { code: "403", color: "bg-red-500" },
                                        { code: "500", color: "bg-red-500" },
                                      ].map((status) => (
                                        <button
                                          key={status.code}
                                          onClick={() =>
                                            setActiveStatus(status.code)
                                          }
                                          className={`px-4 py-2 text-sm font-medium flex items-center gap-2 ${
                                            activeStatus === status.code
                                              ? "bg-[#242424] text-white"
                                              : "text-gray-400 hover:text-white hover:bg-[#242424]/50"
                                          }`}
                                        >
                                          <span
                                            className={`w-2 h-2 rounded-full ${status.color}`}
                                          ></span>
                                          {status.code}
                                        </button>
                                      ))}
                                    </div>

                                    <div className="p-4 bg-[#242424]">
                                      {activeStatus === "200" && (
                                        <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                                          <div className="text-sm">
                                            {"{"}
                                            <div className="ml-4">
                                              <span className="text-[#FF616D]">
                                                "message"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                "Last execution time updated
                                                successfully"
                                              </span>
                                            </div>
                                            {"}"}
                                          </div>
                                        </pre>
                                      )}
                                      {activeStatus === "400" && (
                                        <pre className="text-sm overflow-x-auto whitespace-pre-wrap text-[#E6E6E6]">
                                          {"{"}{" "}
                                          <div className="ml-4">
                                            <span className="text-[#FF616D]">
                                              "Bad Request"
                                            </span>
                                            :{" "}
                                            <span className="text-[#C3E88D]">
                                              Invalid input data
                                            </span>
                                            ,<br />
                                          </div>
                                          {"}"}
                                        </pre>
                                      )}
                                      {activeStatus === "401" && (
                                        <pre className="text-sm overflow-x-auto whitespace-pre-wrap text-[#E6E6E6]">
                                          {"{"}{" "}
                                          <div className="ml-4">
                                            <span className="text-[#FF616D]">
                                              "Unauthorized"
                                            </span>
                                            :{" "}
                                            <span className="text-[#C3E88D]">
                                              Invalid or missing API key
                                            </span>
                                            ,<br />
                                          </div>
                                          {"}"}
                                        </pre>
                                      )}
                                      {activeStatus === "403" && (
                                        <pre className="text-sm overflow-x-auto whitespace-pre-wrap text-[#E6E6E6]">
                                          {"{"}{" "}
                                          <div className="ml-4">
                                            <span className="text-[#FF616D]">
                                              "Not Found"
                                            </span>
                                            :{" "}
                                            <span className="text-[#C3E88D]">
                                              Resource not found
                                            </span>
                                            ,<br />
                                          </div>
                                          {"}"}
                                        </pre>
                                      )}
                                      {activeStatus === "500" && (
                                        <pre className="text-sm overflow-x-auto whitespace-pre-wrap text-[#E6E6E6]">
                                          {"{"}{" "}
                                          <div className="ml-4">
                                            <span className="text-[#FF616D]">
                                              "Internal Server Error"
                                            </span>
                                            :{" "}
                                            <span className="text-[#C3E88D]">
                                              Server-side error
                                            </span>
                                            ,<br />
                                          </div>
                                          {"}"}
                                        </pre>
                                      )}
                                      {/* Add other status responses similarly */}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {expandedSection === "getjobsbyuseraddressapi" && (
                              <div className="space-y-6 w-[80%]">
                                <div className="">
                                  <h3 className="text-xl font-bold pb-4">
                                    Get Jobs By User Address API
                                  </h3>
                                  <p className=" text-gray-400 text-md">
                                    Retrieve all automation jobs associated with
                                    a specific user's Ethereum wallet address.
                                    This endpoint returns detailed information
                                    about each job owned by the user.
                                  </p>
                                </div>

                                <div>
                                  <div className="flex items-center gap-2 bg-[#242424] rounded-md">
                                    <code className="flex-1 p-3 rounded-lg text-sm">
                                      <span className="px-3 py-2 bg-blue-500 text-xs rounded-full mr-3">
                                        GET
                                      </span>
                                      https://data.triggerx.network/api/jobs/user/
                                      {"{user_address}"}
                                    </code>
                                    <button
                                      onClick={() =>
                                        copyToClipboard(
                                          "https://data.triggerx.network/api/jobs/user/{user_address }"
                                        )
                                      }
                                      className="p-2 rounded text-gray-400 hover:text-white transition-colors"
                                    >
                                      {copiedEndpoint ? (
                                        <FiCheck size={20} />
                                      ) : (
                                        <FiCopy size={20} />
                                      )}
                                    </button>
                                  </div>
                                </div>
                                {/* Headers Section */}
                                <div>
                                  <h4 className="text-md  mb-2">Headers</h4>
                                  <div className="bg-[#242424] p-3 rounded-lg">
                                    <table className="w-full text-sm">
                                      <tbody>
                                        <tr>
                                          <td className="py-2 text-gray-400 w-1/3">
                                            TriggerX-Api-Key
                                          </td>
                                          <td className="text-[#C3E88D]  ">
                                            string
                                          </td>
                                          <td className="text-red-400 pl-4">
                                            required
                                          </td>
                                        </tr>
                                        <tr >
                                          <td className="py-2 text-gray-400">
                                            Content-Type
                                          </td>
                                          <td className="text-[#C3E88D]  ">
                                            application/json
                                          </td>
                                          <td className="text-red-400 pl-4">
                                            required
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>

                                {/* Query Parameters */}
                                {/* <div>
                                  <h4 className="text-md mb-2  border-[#4B4A4A] border-b pb-4 mb-4 ">
                                    Query Parameters
                                  </h4>
                                  <div className=" rounded-lg space-y-6">
                                    <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[#FF616D]">
                                          user_address
                                        </span>
                                        <span className="text-[#C3E88D]">
                                          string
                                        </span>
                                      </div>
                                      <p className="text-gray-400 text-sm">
                                        Ethereum wallet address of the user
                                      </p>
                                    </div>
                                  </div>
                                </div> */}

                                  {/* Query Parameters */}
                                  <div>
                                  <h4 className="text-md mb-2  border-[#4B4A4A] border-b pb-4 mb-4 ">
                                    Query Parameters
                                  </h4>
                                  <div className=" rounded-lg space-y-6">
                                    <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[#FF616D]">
                                        api_key 
                                        </span>
                                        <span className="text-[#C3E88D]">
                                          string
                                        </span>
                                      </div>
                                      <p className="text-gray-400 text-sm">
                                      Alternative to using the X-Api-Key header for authentication
                                      </p>
                                    </div>
                                  </div>
                                  <div className=" rounded-lg space-y-6">
                                    <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[#FF616D]">
                                        columns  
                                        </span>
                                        <span className="text-[#C3E88D]">
                                          string
                                        </span>
                                      </div>
                                      <p className="text-gray-400 text-sm">
                                      Comma-separated list of column names to return specific fields
                                      </p>
                                    </div>
                                  </div>
                                  <div className=" rounded-lg space-y-6">
                                    <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[#FF616D]">
                                        filters   
                                        </span>
                                        <span className="text-[#C3E88D]">
                                          string
                                        </span>
                                      </div>
                                      <p className="text-gray-400 text-sm">
                                      SQL-like WHERE clause to filter results
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Response Section */}
                                <div>
                                  <div className="flex items-center gap-2 justify-between my-5  border-[#4B4A4A] border-b pb-4 mb-4">
                                    <div>
                                      <h4 className="text-md ">Response</h4>
                                    </div>
                                    <div>
                                      <select
                                        value={activeStatus}
                                        onChange={(e) =>
                                          setActiveStatus(e.target.value)
                                        }
                                        className="bg-[#1A1A1A] text-gray-400 px-3 py-2 rounded-md border border-[#333333] focus:outline-none focus:border-[#5047FF]"
                                      >
                                        <option value="200">200</option>
                                        <option value="400">400 </option>
                                        <option value="401">401 </option>
                                        <option value="404">404 </option>
                                        <option value="500">500 </option>
                                      </select>
                                      <span className="text-[#C3E88D] ml-3">
                                        application/json
                                      </span>
                                    </div>
                                  </div>
                                  <div className="rounded-lg">
                                    <div className="">
                                      {activeStatus === "200" && (
                                        <>
                                          <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                            <div className="flex items-center gap-2 mb-1">
                                              <span className="text-[#FF616D]">
                                                job_id{" "}
                                              </span>
                                              <span className="text-[#C3E88D]">
                                                string
                                              </span>
                                            </div>
                                            <p className="text-gray-400 text-sm">
                                              ""
                                            </p>
                                          </div>
                                          <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                            <div className="flex items-center gap-2 mb-1">
                                              <span className="text-[#FF616D]">
                                                job_type
                                              </span>
                                              <span className="text-[#C3E88D]">
                                                string
                                              </span>
                                            </div>
                                            <p className="text-gray-400 text-sm">
                                              ""
                                            </p>
                                          </div>
                                          <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                            <div className="flex items-center gap-2 mb-1">
                                              <span className="text-[#FF616D]">
                                                status
                                              </span>
                                              <span className="text-[#C3E88D]">
                                                boolean
                                              </span>
                                            </div>
                                            <p className="text-gray-400 text-sm">
                                              Comma-separated list of columns to
                                              return
                                            </p>
                                          </div>
                                          <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                            <div className="flex items-center gap-2 mb-1">
                                              <span className="text-[#FF616D]">
                                                chain_status
                                              </span>
                                              <span className="text-[#C3E88D]">
                                                string
                                              </span>
                                            </div>
                                            <p className="text-gray-400 text-sm">
                                              Comma-separated list of columns to
                                              return
                                            </p>
                                          </div>
                                          <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                            <div className="flex items-center gap-2 mb-1">
                                              <span className="text-[#FF616D]">
                                                link_job_id
                                              </span>
                                              <span className="text-[#C3E88D]">
                                                string
                                              </span>
                                            </div>
                                            <p className="text-gray-400 text-sm">
                                              Comma-separated list of columns to
                                              return
                                            </p>
                                          </div>
                                        </>
                                      )}
                                      {activeStatus === "400" && (
                                        <pre className="text-sm overflow-x-auto whitespace-pre-wrap text-[#E6E6E6]">
                                          {"{"}{" "}
                                          <div className="ml-4">
                                            <span className="text-[#FF616D]">
                                              "Bad Request"
                                            </span>
                                            :{" "}
                                            <span className="text-[#C3E88D]">
                                              Invalid input data
                                            </span>
                                            ,<br />
                                          </div>
                                          {"}"}
                                        </pre>
                                      )}
                                      {activeStatus === "401" && (
                                        <pre className="text-sm overflow-x-auto whitespace-pre-wrap text-[#E6E6E6]">
                                          {"{"}{" "}
                                          <div className="ml-4">
                                            <span className="text-[#FF616D]">
                                              "Unauthorized"
                                            </span>
                                            :{" "}
                                            <span className="text-[#C3E88D]">
                                              Invalid or missing API key
                                            </span>
                                            ,<br />
                                          </div>
                                          {"}"}
                                        </pre>
                                      )}
                                      {activeStatus === "404" && (
                                        <pre className="text-sm overflow-x-auto whitespace-pre-wrap text-[#E6E6E6]">
                                          {"{"}{" "}
                                          <div className="ml-4">
                                            <span className="text-[#FF616D]">
                                              "Not Found"
                                            </span>
                                            :{" "}
                                            <span className="text-[#C3E88D]">
                                              Resource not found
                                            </span>
                                            ,<br />
                                          </div>
                                          {"}"}
                                        </pre>
                                      )}
                                      {activeStatus === "500" && (
                                        <pre className="text-sm overflow-x-auto whitespace-pre-wrap text-[#E6E6E6]">
                                          {"{"}{" "}
                                          <div className="ml-4">
                                            <span className="text-[#FF616D]">
                                              "Internal Server Error"
                                            </span>
                                            :{" "}
                                            <span className="text-[#C3E88D]">
                                              Server-side error
                                            </span>
                                            ,<br />
                                          </div>
                                          {"}"}
                                        </pre>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="w-full py-4">
                                  {/* Request Data Section */}
                                  <div className="bg-[#1A1A1A] rounded-lg border border-[#333333] overflow-hidden">
                                    <div className="flex items-center justify-between p-4 border-b border-[#333333]">
                                      <h3 className="text-xl font-bold">
                                        API Request
                                      </h3>
                                      <div className="flex gap-2">
                                        <span className="px-5 py-2 bg-blue-500  text-xs rounded-full">
                                          GET
                                        </span>
                                      </div>
                                    </div>

                                    {/* Language Tabs */}
                                    <div className="flex border-b border-[#333333]">
                                      {["cURL"].map((lang) => (
                                        <button
                                          key={lang}
                                          onClick={() =>
                                            setActiveLanguage(`cURL`)
                                          }
                                          className={`px-4 py-2 text-sm font-medium ${
                                            activeLanguage === lang
                                              ? "bg-[#242424] text-white border-b-2 border-[#5047FF]"
                                              : "text-gray-400 hover:text-white hover:bg-[#242424]/50"
                                          }`}
                                        >
                                          {lang}
                                        </button>
                                      ))}
                                    </div>

                                    <div className="p-4 bg-[#242424]">
                                      {activeLanguage === "cURL" && (
                                        <pre
                                          className="text-sm overflow-x-auto whitespace-pre-wrap"
                                          style={{
                                            scrollbarWidth: "thin",
                                            "&::-webkit-scrollbar": {
                                              width: "4px",
                                              height: "4px",
                                            },
                                            "&::-webkit-scrollbar-track": {
                                              backgroundColor: "#1A1A1A",
                                            },
                                            "&::-webkit-scrollbar-thumb": {
                                              backgroundColor: "#333333",
                                              borderRadius: "4px",
                                            },
                                          }}
                                        >
                                          <div>curl --request PUT \ </div>
                                          <div>
                                            {" "}
                                            --url
                                            https://data.triggerx.network/api/jobs/0x123..\
                                          </div>
                                          <div>
                                            --header 'X-Api-Key:
                                            {"<your-api-key>"}'
                                          </div>

                                          <div>--data</div>
                                          <div className="text-sm">
                                            {"{"}
                                            <div className="ml-4">
                                              <span className="text-[#FF616D]">
                                                "user_address (string)"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                "Ethereum wallet address of the
                                                user "
                                              </span>
                                            </div>
                                            {"}"}
                                          </div>
                                        </pre>
                                      )}

                                      {/* Add other language examples similarly */}
                                    </div>
                                  </div>

                                  {/* Response Section */}
                                  <div className="mt-5 bg-[#1A1A1A] rounded-lg border border-[#333333] overflow-hidden">
                                    <div className="flex items-center justify-between p-4 border-b border-[#333333]">
                                      <h3 className="text-xl font-bold">
                                        Response
                                      </h3>
                                    </div>

                                    {/* Status Code Tabs */}
                                    <div className="flex border-b border-[#333333]">
                                      {[
                                        { code: "200", color: "bg-green-500" },
                                        { code: "400", color: "bg-yellow-500" },
                                        { code: "401", color: "bg-red-500" },
                                        { code: "403", color: "bg-red-500" },
                                        { code: "500", color: "bg-red-500" },
                                      ].map((status) => (
                                        <button
                                          key={status.code}
                                          onClick={() =>
                                            setActiveStatus(status.code)
                                          }
                                          className={`px-4 py-2 text-sm font-medium flex items-center gap-2 ${
                                            activeStatus === status.code
                                              ? "bg-[#242424] text-white"
                                              : "text-gray-400 hover:text-white hover:bg-[#242424]/50"
                                          }`}
                                        >
                                          <span
                                            className={`w-2 h-2 rounded-full ${status.color}`}
                                          ></span>
                                          {status.code}
                                        </button>
                                      ))}
                                    </div>

                                    <div className="p-4 bg-[#242424]">
                                      {activeStatus === "200" && (
                                        <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                                          <div className="text-sm">
                                            {"{"}
                                            <div className="ml-4">
                                              <span className="text-[#FF616D]">
                                                "job_id"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                123
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "job_type"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                "1"
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "status"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                "true"
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "chain_status"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                0
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "link_job_id"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                124
                                              </span>
                                            </div>
                                            {"}"}
                                          </div>
                                          <div className="text-sm">
                                            {"{"}
                                            <div className="ml-4">
                                              <span className="text-[#FF616D]">
                                                "job_id"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                124
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "job_type"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                "2"
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "chain_status"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                true
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "link_job_id"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                -1
                                              </span>
                                            </div>
                                            {"}"}
                                          </div>
                                        </pre>
                                      )}
                                      {activeStatus === "400" && (
                                        <pre className="text-sm overflow-x-auto whitespace-pre-wrap text-[#E6E6E6]">
                                          {"{"}{" "}
                                          <div className="ml-4">
                                            <span className="text-[#FF616D]">
                                              "Bad Request"
                                            </span>
                                            :{" "}
                                            <span className="text-[#C3E88D]">
                                              Invalid input data
                                            </span>
                                            ,<br />
                                          </div>
                                          {"}"}
                                        </pre>
                                      )}
                                      {activeStatus === "401" && (
                                        <pre className="text-sm overflow-x-auto whitespace-pre-wrap text-[#E6E6E6]">
                                          {"{"}{" "}
                                          <div className="ml-4">
                                            <span className="text-[#FF616D]">
                                              "Unauthorized"
                                            </span>
                                            :{" "}
                                            <span className="text-[#C3E88D]">
                                              Invalid or missing API key
                                            </span>
                                            ,<br />
                                          </div>
                                          {"}"}
                                        </pre>
                                      )}
                                      {activeStatus === "403" && (
                                        <pre className="text-sm overflow-x-auto whitespace-pre-wrap text-[#E6E6E6]">
                                          {"{"}{" "}
                                          <div className="ml-4">
                                            <span className="text-[#FF616D]">
                                              "Not Found"
                                            </span>
                                            :{" "}
                                            <span className="text-[#C3E88D]">
                                              Resource not found
                                            </span>
                                            ,<br />
                                          </div>
                                          {"}"}
                                        </pre>
                                      )}
                                      {activeStatus === "500" && (
                                        <pre className="text-sm overflow-x-auto whitespace-pre-wrap text-[#E6E6E6]">
                                          {"{"}{" "}
                                          <div className="ml-4">
                                            <span className="text-[#FF616D]">
                                              "Internal Server Error"
                                            </span>
                                            :{" "}
                                            <span className="text-[#C3E88D]">
                                              Server-side error
                                            </span>
                                            ,<br />
                                          </div>
                                          {"}"}
                                        </pre>
                                      )}
                                      {/* Add other status responses similarly */}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {expandedSection === "deletejobapi" && (
                              <div className="space-y-6 w-[80%]">
                                <div className="">
                                  <h3 className="text-xl font-bold pb-4">
                                    Delete Job API
                                  </h3>
                                  <p className="text-gray-400 text-md">
                                    Delete an existing automation job by its ID.
                                    This action cannot be undone.
                                  </p>
                                </div>

                                <div>
                                  <div className="flex items-center gap-2 bg-[#242424] rounded-md">
                                    <code className="flex-1 p-3 rounded-lg text-sm">
                                      <span className="px-4 py-2 bg-yellow-500 text-xs rounded-full mr-3">
                                        PUT
                                      </span>
                                      https://data.triggerx.network/api/jobs/delete/
                                      <span>{"{id}"}</span>
                                    </code>
                                    <button
                                      onClick={() =>
                                        copyToClipboard(
                                          "https://data.triggerx.network/api/jobs/delete/{id}"
                                        )
                                      }
                                      className="p-2 rounded text-gray-400 hover:text-white transition-colors"
                                    >
                                      {copiedEndpoint ? (
                                        <FiCheck size={20} />
                                      ) : (
                                        <FiCopy size={20} />
                                      )}
                                    </button>
                                  </div>
                                </div>

                                {/* Headers Section */}
                                <div>
                                  <h4 className="text-md mb-2">Headers</h4>
                                  <div className="bg-[#242424] p-3 rounded-lg">
                                    <table className="w-full text-sm">
                                      <tbody>
                                        <tr>
                                          <td className="py-2 text-gray-400 w-1/3">
                                            TriggerX-Api-Key
                                          </td>
                                          <td className="text-[#C3E88D] ">
                                            string
                                          </td>
                                          <td className="text-red-400 pl-4">
                                            required
                                          </td>
                                        </tr>
                                        <tr >
                                          <td className="py-2 text-gray-400">
                                            Content-Type
                                          </td>
                                          <td className="text-[#C3E88D]  ">
                                            application/json
                                          </td>
                                          <td className="text-red-400 pl-4">
                                            required
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
  {/* Query Parameters */}
  <div>
                                  <h4 className="text-md mb-2  border-[#4B4A4A] border-b pb-4 mb-4 ">
                                    Query Parameters
                                  </h4>
                                  <div className=" rounded-lg space-y-6">
                                    <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[#FF616D]">
                                        api_key 
                                        </span>
                                        <span className="text-[#C3E88D]">
                                          string
                                        </span>
                                      </div>
                                      <p className="text-gray-400 text-sm">
                                      Alternative to using the X-Api-Key header for authentication
                                      </p>
                                    </div>
                                  </div>
                                  <div className=" rounded-lg space-y-6">
                                    <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[#FF616D]">
                                        columns  
                                        </span>
                                        <span className="text-[#C3E88D]">
                                          string
                                        </span>
                                      </div>
                                      <p className="text-gray-400 text-sm">
                                      Comma-separated list of column names to return specific fields
                                      </p>
                                    </div>
                                  </div>
                                  <div className=" rounded-lg space-y-6">
                                    <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[#FF616D]">
                                        filters   
                                        </span>
                                        <span className="text-[#C3E88D]">
                                          string
                                        </span>
                                      </div>
                                      <p className="text-gray-400 text-sm">
                                      SQL-like WHERE clause to filter results
                                      </p>
                                    </div>
                                  </div>
                                </div>
                               
                                {/* cURL Example */}
                                <div className="w-full py-4">
                                  <div className="bg-[#1A1A1A] rounded-lg border border-[#333333] overflow-hidden">
                                    <div className="flex items-center justify-between p-4 border-b border-[#333333]">
                                      <h3 className="text-xl font-bold">
                                        API Request
                                      </h3>
                                    </div>

                                    <div className="p-4 bg-[#242424]">
                                      <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                                        <div>curl --request DELETE \ </div>
                                        <div>
                                          --url
                                          https://data.triggerx.network/api/jobs/delete/123
                                          \
                                        </div>
                                        <div>
                                          --header 'X-Api-Key:{" "}
                                          {"<your-api-key>"}' \
                                        </div>
                                        <div>--data</div>
                                          <div className="text-sm">
                                            {"{"}
                                            <div className="ml-4">
                                              <span className="text-[#FF616D]">
                                                "id (Integer)"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                "The ID of the job to delete
                                                "
                                              </span>
                                            </div>
                                            {"}"}
                                          </div>
                                      </pre>
                                    </div>
                                  </div>
                                </div>

                                {/* Response Section */}
                                <div className="mt-5 bg-[#1A1A1A] rounded-lg border border-[#333333] overflow-hidden">
                                    <div className="flex items-center justify-between p-4 border-b border-[#333333]">
                                      <h3 className="text-xl font-bold">
                                        Response
                                      </h3>
                                    </div>

                                    {/* Status Code Tabs */}
                                    <div className="flex border-b border-[#333333]">
                                      {[
                                        { code: "200", color: "bg-green-500" },
                                        { code: "400", color: "bg-yellow-500" },
                                        { code: "401", color: "bg-red-500" },
                                        { code: "403", color: "bg-red-500" },
                                        { code: "500", color: "bg-red-500" },
                                      ].map((status) => (
                                        <button
                                          key={status.code}
                                          onClick={() =>
                                            setActiveStatus(status.code)
                                          }
                                          className={`px-4 py-2 text-sm font-medium flex items-center gap-2 ${
                                            activeStatus === status.code
                                              ? "bg-[#242424] text-white"
                                              : "text-gray-400 hover:text-white hover:bg-[#242424]/50"
                                          }`}
                                        >
                                          <span
                                            className={`w-2 h-2 rounded-full ${status.color}`}
                                          ></span>
                                          {status.code}
                                        </button>
                                      ))}
                                    </div>

                                    <div className="p-4 bg-[#242424]">
                                    {activeStatus === "200" && (
                                        <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                                          <div className="text-sm">
                                            {"{"}
                                            <div className="ml-4">
                                              <span className="text-[#FF616D]">
                                                "message"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                "Job deleted successfully"
                                              </span>
                                            </div>
                                            {"}"}
                                          </div>
                                        </pre>
                                      )}
                                      {activeStatus === "400" && (
                                        <pre className="text-sm overflow-x-auto whitespace-pre-wrap text-[#E6E6E6]">
                                          {"{"}{" "}
                                          <div className="ml-4">
                                            <span className="text-[#FF616D]">
                                              "Bad Request"
                                            </span>
                                            :{" "}
                                            <span className="text-[#C3E88D]">
                                              Invalid input data
                                            </span>
                                            ,<br />
                                          </div>
                                          {"}"}
                                        </pre>
                                      )}
                                      {activeStatus === "401" && (
                                        <pre className="text-sm overflow-x-auto whitespace-pre-wrap text-[#E6E6E6]">
                                          {"{"}{" "}
                                          <div className="ml-4">
                                            <span className="text-[#FF616D]">
                                              "Unauthorized"
                                            </span>
                                            :{" "}
                                            <span className="text-[#C3E88D]">
                                              Invalid or missing API key
                                            </span>
                                            ,<br />
                                          </div>
                                          {"}"}
                                        </pre>
                                      )}
                                      {activeStatus === "403" && (
                                        <pre className="text-sm overflow-x-auto whitespace-pre-wrap text-[#E6E6E6]">
                                          {"{"}{" "}
                                          <div className="ml-4">
                                            <span className="text-[#FF616D]">
                                              "Not Found"
                                            </span>
                                            :{" "}
                                            <span className="text-[#C3E88D]">
                                              Resource not found
                                            </span>
                                            ,<br />
                                          </div>
                                          {"}"}
                                        </pre>
                                      )}
                                      {activeStatus === "500" && (
                                        <pre className="text-sm overflow-x-auto whitespace-pre-wrap text-[#E6E6E6]">
                                          {"{"}{" "}
                                          <div className="ml-4">
                                            <span className="text-[#FF616D]">
                                              "Internal Server Error"
                                            </span>
                                            :{" "}
                                            <span className="text-[#C3E88D]">
                                              Server-side error
                                            </span>
                                            ,<br />
                                          </div>
                                          {"}"}
                                        </pre>
                                      )}
                                      {/* Add other status responses similarly */}
                                    </div>
                                  </div>
                              </div>
                            )}
                            {expandedSection === "getuserapi" && (
                              <div className="space-y-6 w-[80%]">
                                <div className="">
                                  <h3 className="text-xl font-bold pb-4">
                                    Get User API
                                  </h3>
                                  <p className="text-gray-400 text-md">
                                    Retrieve user information including their
                                    job IDs and account balance.
                                  </p>
                                </div>

                                <div>
                                  <div className="flex items-center gap-2 bg-[#242424] rounded-md">
                                    <code className="flex-1 p-3 rounded-lg text-sm">
                                      <span className="px-3 py-2 bg-blue-500 text-xs rounded-full mr-3">
                                        GET
                                      </span>
                                      https://data.triggerx.network/api/users/
                                      <span>{"{id}"}</span>
                                    </code>
                                    <button
                                      onClick={() =>
                                        copyToClipboard(
                                          "https://data.triggerx.network/api/users/{id}"
                                        )
                                      }
                                      className="p-2 rounded text-gray-400 hover:text-white transition-colors"
                                    >
                                      {copiedEndpoint ? (
                                        <FiCheck size={20} />
                                      ) : (
                                        <FiCopy size={20} />
                                      )}
                                    </button>
                                  </div>
                                </div>

                                {/* Headers Section */}
                                <div>
                                  <h4 className="text-md mb-2">Headers</h4>
                                  <div className="bg-[#242424] p-3 rounded-lg">
                                    <table className="w-full text-sm">
                                      <tbody>
                                        <tr>
                                          <td className="py-2 text-gray-400 w-1/3">
                                            TriggerX-Api-Key
                                          </td>
                                          <td className="text-[#C3E88D]  ">
                                            string
                                          </td>
                                          <td className="text-red-400 pl-4">
                                            required
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="py-2 text-gray-400">
                                            Content-Type
                                          </td>
                                          <td className="text-[#C3E88D]  ">
                                            application/json
                                          </td>
                                          <td className="text-red-400 pl-4">
                                            required
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                                {/* Query Parameters */}
                                {/* <div>
                                  <h4 className="text-md mb-2  border-[#4B4A4A] border-b pb-4 mb-4 ">
                                    Query Parameters
                                  </h4>
                                  <div className=" rounded-lg space-y-6">
                                    <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[#FF616D]">
                                          id
                                        </span>
                                        <span className="text-[#C3E88D]">
                                          Integer
                                        </span>
                                      </div>
                                      <p className="text-gray-400 text-sm">
                                      The ID of the user to retrieve 
                                      </p>
                                    </div>
                                  </div>
                                </div> */}
                                     {/* Query Parameters */}
                                <div>
                                  <h4 className="text-md mb-2  border-[#4B4A4A] border-b pb-4 mb-4 ">
                                    Query Parameters
                                  </h4>
                                  <div className=" rounded-lg space-y-6">
                                    <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[#FF616D]">
                                        api_key 
                                        </span>
                                        <span className="text-[#C3E88D]">
                                          string
                                        </span>
                                      </div>
                                      <p className="text-gray-400 text-sm">
                                      Alternative to using the X-Api-Key header for authentication
                                      </p>
                                    </div>
                                  </div>
                                  <div className=" rounded-lg space-y-6">
                                    <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[#FF616D]">
                                        columns  
                                        </span>
                                        <span className="text-[#C3E88D]">
                                          string
                                        </span>
                                      </div>
                                      <p className="text-gray-400 text-sm">
                                      Comma-separated list of column names to return specific fields
                                      </p>
                                    </div>
                                  </div>
                                  <div className=" rounded-lg space-y-6">
                                    <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[#FF616D]">
                                        filters   
                                        </span>
                                        <span className="text-[#C3E88D]">
                                          string
                                        </span>
                                      </div>
                                      <p className="text-gray-400 text-sm">
                                      SQL-like WHERE clause to filter results
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Response Section */}
                                <div>
                                  <div className="flex items-center gap-2 justify-between my-5  border-[#4B4A4A] border-b pb-4 mb-4">
                                    <div>
                                      <h4 className="text-md ">Response</h4>
                                    </div>
                                    <div>
                                      <select
                                        value={activeStatus}
                                        onChange={(e) =>
                                          setActiveStatus(e.target.value)
                                        }
                                        className="bg-[#1A1A1A] text-gray-400 px-3 py-2 rounded-md border border-[#333333] focus:outline-none focus:border-[#5047FF]"
                                      >
                                        <option value="200">200</option>
                                        <option value="400">400 </option>
                                        <option value="401">401 </option>
                                        <option value="404">404 </option>
                                        <option value="500">500 </option>
                                      </select>
                                      <span className="text-[#C3E88D] ml-3">
                                        application/json
                                      </span>
                                    </div>
                                  </div>
                                  <div className="rounded-lg">
                                    <div className="">
                                      {activeStatus === "200" && (
                                        <>
                                          <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                            <div className="flex items-center gap-2 mb-1">
                                              <span className="text-[#FF616D]">
                                              user_id
                                              </span>
                                              <span className="text-[#C3E88D]">
                                                string
                                              </span>
                                            </div>
                                            <p className="text-gray-400 text-sm">
                                             ""
                                            </p>
                                          </div>
                                          <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                            <div className="flex items-center gap-2 mb-1">
                                              <span className="text-[#FF616D]">
                                              user_address
                                              </span>
                                              <span className="text-[#C3E88D]">
                                                string
                                              </span>
                                            </div>
                                            <p className="text-gray-400 text-sm">
                                              ""
                                            </p>
                                          </div>
                                          <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                            <div className="flex items-center gap-2 mb-1">
                                              <span className="text-[#FF616D]">
                                              job_ids
                                              </span>
                                              <span className="text-[#C3E88D]">
                                                string
                                              </span>
                                            </div>
                                            <p className="text-gray-400 text-sm">
                                             ""
                                            </p>
                                          </div>
                                          <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                            <div className="flex items-center gap-2 mb-1">
                                              <span className="text-[#FF616D]">
                                              account_balance
                                              </span>
                                              <span className="text-[#C3E88D]">
                                                string
                                              </span>
                                            </div>
                                            <p className="text-gray-400 text-sm">
                                             ""
                                            </p>
                                          </div>
                                         
                                        </>
                                      )}
                                      {activeStatus === "400" && (
                                        <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                          <p className="text-gray-400 mb-2">
                                            Bad Request
                                          </p>
                                          <pre className=" mb-2">
                                            Error{" "}
                                            <span className="text-[#C3E88D]">
                                              String
                                            </span>
                                          </pre>
                                          <pre className="text-sm text-red-400">
                                            <span className="text-white">
                                              Example :{" "}
                                            </span>
                                            "Invalid input data"
                                          </pre>
                                        </div>
                                      )}
                                      {activeStatus === "401" && (
                                        <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                          <p className="text-gray-400 mb-2">
                                            Unauthorized
                                          </p>
                                          <pre className=" mb-2">
                                            Error{" "}
                                            <span className="text-[#C3E88D]">
                                              String
                                            </span>
                                          </pre>
                                          <pre className="text-sm text-red-400">
                                            <span className="text-white">
                                              Example :{" "}
                                            </span>
                                            "Invalid or missing API key" "
                                          </pre>
                                        </div>
                                      )}
                                      {activeStatus === "404" && (
                                        <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                          <p className="text-gray-400 mb-2">
                                            Not Found
                                          </p>

                                          <pre className=" mb-2">
                                            Error{" "}
                                            <span className="text-[#C3E88D]">
                                              String
                                            </span>
                                          </pre>
                                          <pre className="text-sm text-red-400">
                                            <span className="text-white">
                                              Example :{" "}
                                            </span>
                                            "Resource not found"
                                          </pre>
                                        </div>
                                      )}

                                      {activeStatus === "500" && (
                                        <div className=" border-[#4B4A4A] border-b pb-4 mb-4">
                                          <p className="text-gray-400 mb-2">
                                            Internal Server Error
                                          </p>
                                          <pre className=" mb-2">
                                            Error{" "}
                                            <span className="text-[#C3E88D]">
                                              String
                                            </span>
                                          </pre>
                                          <pre className="text-sm text-red-400">
                                            <span className="text-white">
                                              Example :{" "}
                                            </span>
                                            "Server-side error"
                                          </pre>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* cURL Example */}
                                <div className="w-full py-4">
                                  <div className="bg-[#1A1A1A] rounded-lg border border-[#333333] overflow-hidden">
                                    <div className="flex items-center justify-between p-4 border-b border-[#333333]">
                                      <h3 className="text-xl font-bold">
                                        API Request
                                      </h3>
                                    </div>
                                    <div className="p-4 bg-[#242424]">
                                      <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                                        <div>curl --request GET \ </div>
                                        <div>
                                          {" "}
                                          --url
                                          https://data.triggerx.network/api/users/123
                                          \
                                        </div>
                                        <div>
                                          {" "}
                                          --header 'X-Api-Key:{" "}
                                          {"<your-api-key>"}'
                                        </div>
                                        <div>--data</div>
                                          <div className="text-sm">
                                            {"{"}
                                            <div className="ml-4">
                                              <span className="text-[#FF616D]">
                                                "id (Integer)"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                "The ID of the user to retrieve
                                                "
                                              </span>
                                            </div>
                                            {"}"}
                                          </div>
                                      </pre>
                                    </div>
                                  </div>
                                   {/* Response Section */}
                                   <div className="mt-5 bg-[#1A1A1A] rounded-lg border border-[#333333] overflow-hidden">
                                    <div className="flex items-center justify-between p-4 border-b border-[#333333]">
                                      <h3 className="text-xl font-bold">
                                        Response
                                      </h3>
                                    </div>

                                    {/* Status Code Tabs */}
                                    <div className="flex border-b border-[#333333]">
                                      {[
                                        { code: "200", color: "bg-green-500" },
                                        { code: "400", color: "bg-yellow-500" },
                                        { code: "401", color: "bg-red-500" },
                                        { code: "403", color: "bg-red-500" },
                                        { code: "500", color: "bg-red-500" },
                                      ].map((status) => (
                                        <button
                                          key={status.code}
                                          onClick={() =>
                                            setActiveStatus(status.code)
                                          }
                                          className={`px-4 py-2 text-sm font-medium flex items-center gap-2 ${
                                            activeStatus === status.code
                                              ? "bg-[#242424] text-white"
                                              : "text-gray-400 hover:text-white hover:bg-[#242424]/50"
                                          }`}
                                        >
                                          <span
                                            className={`w-2 h-2 rounded-full ${status.color}`}
                                          ></span>
                                          {status.code}
                                        </button>
                                      ))}
                                    </div>

                                    <div className="p-4 bg-[#242424]">
                                      {activeStatus === "200" && (
                                        <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                                          <div className="text-sm">
                                            {"{"}
                                            <div className="ml-4">
                                              <span className="text-[#FF616D]">
                                                "user_id"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                123
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "user_address"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                "0x..."
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "job_ids"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                                "[1, 2, 3]"
                                              </span>
                                              ,<br />
                                              <span className="text-[#FF616D]">
                                                "account_balance"
                                              </span>
                                              :{" "}
                                              <span className="text-[#C3E88D]">
                                              1000000000000000000
                                              </span>
                                           
                                             
                                          
                                            </div>
                                            {"}"}
                                          </div>
                                          
                                        </pre>
                                      )}
                                      {activeStatus === "400" && (
                                        <pre className="text-sm overflow-x-auto whitespace-pre-wrap text-[#E6E6E6]">
                                          {"{"}{" "}
                                          <div className="ml-4">
                                            <span className="text-[#FF616D]">
                                              "Bad Request"
                                            </span>
                                            :{" "}
                                            <span className="text-[#C3E88D]">
                                              Invalid input data
                                            </span>
                                            ,<br />
                                          </div>
                                          {"}"}
                                        </pre>
                                      )}
                                      {activeStatus === "401" && (
                                        <pre className="text-sm overflow-x-auto whitespace-pre-wrap text-[#E6E6E6]">
                                          {"{"}{" "}
                                          <div className="ml-4">
                                            <span className="text-[#FF616D]">
                                              "Unauthorized"
                                            </span>
                                            :{" "}
                                            <span className="text-[#C3E88D]">
                                              Invalid or missing API key
                                            </span>
                                            ,<br />
                                          </div>
                                          {"}"}
                                        </pre>
                                      )}
                                      {activeStatus === "403" && (
                                        <pre className="text-sm overflow-x-auto whitespace-pre-wrap text-[#E6E6E6]">
                                          {"{"}{" "}
                                          <div className="ml-4">
                                            <span className="text-[#FF616D]">
                                              "Not Found"
                                            </span>
                                            :{" "}
                                            <span className="text-[#C3E88D]">
                                              Resource not found
                                            </span>
                                            ,<br />
                                          </div>
                                          {"}"}
                                        </pre>
                                      )}
                                      {activeStatus === "500" && (
                                        <pre className="text-sm overflow-x-auto whitespace-pre-wrap text-[#E6E6E6]">
                                          {"{"}{" "}
                                          <div className="ml-4">
                                            <span className="text-[#FF616D]">
                                              "Internal Server Error"
                                            </span>
                                            :{" "}
                                            <span className="text-[#C3E88D]">
                                              Server-side error
                                            </span>
                                            ,<br />
                                          </div>
                                          {"}"}
                                        </pre>
                                      )}
                                      {/* Add other status responses similarly */}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </Layout>
  );
};

export default ApiCreation;