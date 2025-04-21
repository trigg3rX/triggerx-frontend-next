'use client';

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaGithub, FaExclamationTriangle } from "react-icons/fa";
import sanityClient from "../../../lib/sanity";
import imageUrlBuilder from "@sanity/image-url";
import { PortableText } from "@portabletext/react";
import Layout from "../../../components/layout/Layout";
import DevHubItemLoading from "./loading";

// --- Sanity Image URL Builder Setup ---
const builder = imageUrlBuilder(sanityClient);
function urlFor(source) {
  if (source?.asset) {
    return builder.image(source);
  }
  return null;
}

async function getBlog(slug) {
  const query = `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    subtitle,
    image, 
    chainlinkProducts,
    productVersions,
    readTime,
    requires,
    body, 
    headingPairs[] {
      displayHeading, 
      h2Heading      
    },    slug { current }, 
    githubUrl
}`;

  return sanityClient.fetch(query, { slug });
}

function DevhubItem() {
  const params = useParams();
  const slug = params?.slug;
  const [postData, setPostData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeHeading, setActiveHeading] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      if (!slug) {
        setIsLoading(false);
        setError("No post specified.");
        return;
      }

      setIsLoading(true);
      setPostData(null);
      setError(null);
      try {
        const data = await getBlog(slug);
        console.log("data", data);

        if (data) {
          setPostData(data); // Store fetched data in state
        } else {
          setError("Post not found.");
        }
      } catch (err) {
        console.error("Error fetching post from Sanity:", err);
        setError("Failed to load post data.");
      } finally {
        setIsLoading(false); // Ensure loading is set to false
      }
    }

    fetchData();
  }, [slug]);

  useEffect(() => {
    if (!postData || isLoading || error) {
      return; // Don't run if no data, loading, or error
    }

    const handleScroll = () => {
      const headings = document.querySelectorAll("h2");
      let currentActive = "";

      for (let i = 0; i < headings.length; i++) {
        const rect = headings[i].getBoundingClientRect();

        // If heading is above 120px, set it as active
        if (rect.top <= 250) {
          currentActive = headings[i].innerText;
        } else {
          break; // Stop checking further, as the next heading hasn't reached 120px yet
        }
      }
      setActiveHeading(currentActive);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [error, isLoading, postData]);

  if (isLoading) {
    return <DevHubItemLoading />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!postData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Post not found.</p>
      </div>
    );
  }

  // --- Get Image URL Safely ---
  const headerImageUrl = urlFor(postData.image)
    ?.width(1200)
    .auto("format")
    .url();

  // --- Format Read Time (Example: assuming postData.readTime is minutes) ---
  const readTimeDisplay = postData.readTime
    ? `${postData.readTime} MINUTES`
    : "N/A";

  // ButtonLink Component
  const ButtonLink = ({ value }) => {
    if (!value?.url || !value?.text) {
      return null;
    }
    return (
      <div className="my-8 flex justify-start relative bg-[#222222] text-black border border-black px-6 py-2 sm:px-8 sm:py-3 rounded-full group transition-transform w-max">
        <span className="absolute inset-0 bg-[#222222] border border-[#FFFFFF80]/50 rounded-full scale-100 translate-y-0 transition-all duration-300 ease-out group-hover:translate-y-2"></span>
        <span className="absolute inset-0 bg-white rounded-full scale-100 translate-y-0 group-hover:translate-y-0"></span>
        <a
          href={value.url}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 text-black font-semibold text-lg"
        >
          {value.text}
        </a>
      </div>
    );
  };

  // Disclaimer Component
  const Disclaimer = ({ value }) => {
    if (!value?.text) {
      return null;
    }
    return (
      <div className="rounded-2xl bg-[#F9FFE1] p-6 my-8 text-black shadow">
        <div className="flex items-center mb-3">
          <FaExclamationTriangle className="text-red-500 mr-3 text-xl flex-shrink-0" />
          <h3 className="font-bold text-lg text-black">
            {value.title || "Disclaimer"}
          </h3>
        </div>
        <p className="text-base text-gray-800 leading-relaxed whitespace-pre-wrap">
          {value.text}
        </p>
      </div>
    );
  };

  // StepsAccordion Component (with internal state for toggling)
  const StepsAccordion = ({ value }) => {
    const [openSteps, setOpenSteps] = React.useState({});

    if (!value?.steps || value.steps.length === 0) {
      return null;
    }

    const toggleStep = (index) => {
      setOpenSteps((prev) => ({
        ...prev,
        [index]: !prev[index],
      }));
    };

    return (
      <div className="my-10">
        <h2
          id={value.heading}
          className="text-xl font-bold text-white mb-6 uppercase tracking-widest"
        >
          {value.heading}
        </h2>
        <div className="space-y-3">
          {value.steps.map((step, index) => (
            <div
              key={step._key || index}
              className="bg-[#242323] rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <button
                onClick={() => toggleStep(index)}
                className="w-full flex justify-between items-center px-5 py-4 text-left text-white" // Added focus styles
                aria-expanded={!!openSteps[index]}
                aria-controls={`step-content-${index}`}
              >
                <span className="font-medium text-base md:text-lg flex items-center">
                  <span className="mr-3 text-gray-400">{index + 1}</span>{" "}
                  {step.title || `Step ${index + 1}`}
                </span>
                <svg
                  className={`w-5 h-5 transform transition-transform duration-300 text-gray-400 ${openSteps[index] ? "rotate-180" : "rotate-0"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
              <div
                id={`step-content-${index}`}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openSteps[index] ? "max-h-screen" : "max-h-0"}`}
              >
                <div className="px-5 pb-5 pt-2 bg-[#242323]">
                  <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                    {step.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Layout>
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 min-h-screen md:mt-[17rem] mt-[10rem]">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-white !leading-[60px]">
          {postData.title}
        </h1>
        {/* {postData.subtitle && (
          <h4 className="text-sm sm:text-base lg:text-lg text-[#A2A2A2] leading-relaxed">
            {postData.subtitle}
          </h4>
        )} */}
      </div>

      {/* Main Content Area */}
      <div className="bg-[#131313] rounded-3xl border border-gray-700 p-6 w-[90%] mx-auto">
        {/* Top Section */}
        <div className="mb-8">
          {headerImageUrl ? (
            <div className="w-[95%] mx-auto rounded-3xl overflow-hidden h-max">
              <img
                src={headerImageUrl}
                alt={postData.title || "Header image"}
                className="!relative w-full h-auto"
              />
            </div>
          ) : (
            <div className="rounded-2xl bg-gray-800 h-60 flex items-center justify-center w-full mb-8 text-gray-500">
              No Image Available
            </div>
          )}

          {/* Info Grid */}
          <div className="flex text-md md:text-sm text-white justify-evenly gap-9 my-5 md:flex-row flex-col text-xs">
            {/* <h3 className="mb-3 text-start flex items-center">
              <span className="w-[110px] flex font-bold">Required Time :</span>
              <span className="text-white ml-3 text-left md:text-sm text-xs">
                {readTimeDisplay}
              </span>
            </h3> */}
            <h3 className="text-start flex items-center">
              <span className="w-[110px] flex font-bold">Requires :</span>
              <span className="text-white ml-3 text-left md:text-sm text-xs">
                {postData.requires || "N/A"}
              </span>
            </h3>
          </div>

          {/* Buttons */}
          <div className="relative bg-[#222222] text-[#000000] border border-[#222222] px-6 py-2 sm:px-8 sm:py-3 rounded-full group transition-transform w-max mx-auto flex items-center justify-center">
            <span className="absolute inset-0 bg-[#222222] border border-[#FFFFFF80]/50 rounded-full scale-100 translate-y-0 transition-all duration-300 ease-out group-hover:translate-y-2"></span>
            <span className="absolute inset-0 bg-[#F8FF7C] rounded-full scale-100 translate-y-0 group-hover:translate-y-0"></span>
            <a
              href={postData.githubUrl || "#"}
              className="w-max relative z-10 rounded-full transition-all duration-300 ease-out text-xs sm:text-base flex items-center"
            >
              <FaGithub className="mr-2" />
              Open Github
            </a>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-2 md:gap-8 w-[87%] mx-auto">
        {/* Table of Content */}
        <aside className="w-full md:w-1/4 min-w-[230px] md:sticky top-24 h-full">
          {/* Mobile Dropdown */}
          <div className="md:hidden relative my-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex justify-between items-center px-4 py-2 bg-[#141313] text-white rounded-lg border border-[#5F5F5F] text-xs font-actayWide"
            >
              Table Of Content
              <span
                className={`transform transition ${isOpen ? "rotate-180" : ""}`}
              >
                {/* <img src={arrow} alt="arrow"></Image> */}
              </span>
            </button>

            {isOpen && (
              <ul className="absolute w-full bg-[#141313] text-white rounded-lg border border-[#5F5F5F] mt-2 shadow-lg z-10 text-xs font-actay">
                {postData.headingPairs?.map((pair, index) => (
                  <li key={index} className="py-2 px-2">
                    <a
                      href={`#${pair.h2Heading}`}
                      onClick={(e) => {
                        e.preventDefault();
                        const targetElement = document.getElementById(
                          pair.h2Heading
                        );
                        if (targetElement) {
                          const yOffset = -160; // Adjust the offset (200px from top)
                          const y =
                            targetElement.getBoundingClientRect().top +
                            window.scrollY +
                            yOffset;
                          window.scrollTo({ top: y, behavior: "smooth" });
                        }
                      }}
                      className={`text-xs hover:underline ${
                        activeHeading === pair.h2Heading
                          ? "text-green-400 font-bold"
                          : "text-gray-300"
                      }`}
                    >
                      [ {index + 1} ] {pair.displayHeading}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <h2 className="hidden md:block font-actayWide text-sm lg:text-lg font-extrabold my-10">
            Table of Content
          </h2>
          <ul className="hidden md:block space-y-2 font-actay">
            {postData.headingPairs?.map((pair, index) => (
              <li key={index}>
                <a
                  href={`#${pair.h2Heading}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const targetElement = document.getElementById(
                      pair.h2Heading
                    );
                    if (targetElement) {
                      const yOffset = -160; // Adjust the offset (200px from top)
                      const y =
                        targetElement.getBoundingClientRect().top +
                        window.scrollY +
                        yOffset;
                      window.scrollTo({ top: y, behavior: "smooth" });
                    }
                  }}
                  className={`text-xs lg:text-sm 2xl:text-base hover:underline ${
                    activeHeading === pair.h2Heading
                      ? "text-green-400 font-bold"
                      : "text-gray-300"
                  }`}
                >
                  [ {index + 1} ] {pair.displayHeading}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        {/* Blog Content */}
        <article className="w-full md:w-3/4 mt-0">
          <PortableText
            value={postData.body}
            components={{
              types: {
                image: ({ value }) => (
                  <div className="my-10 w-full h-auto">
                    {value?.asset?.url && (
                      <img
                        src={value.asset.url}
                        alt={value.alt || "Blog Image"}
                        width={2500}
                        height={2000}
                        className="rounded-2xl !relative w-full h-auto"
                      />
                    )}
                  </div>
                ),
                youtube: ({ value }) => (
                  <div className="my-4 aspect-w-16 aspect-h-9">
                    <iframe
                      className="w-full h-full rounded-lg"
                      src={`https://www.youtube.com/embed/${value?.url?.split("v=")[1]}`}
                      title="YouTube video player"
                      style={{ border: "none" }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ),

                buttonLink: ({ value }) => <ButtonLink value={value} />,
                disclaimer: ({ value }) => <Disclaimer value={value} />,
                stepsAccordion: ({ value }) => <StepsAccordion value={value} />,
              },
              marks: {
                strong: ({ children }) => (
                  <strong className="font-bold">{children}</strong>
                ),
                em: ({ children }) => <em className="italic">{children}</em>,
                code: ({ children }) => (
                  <code className="bg-gray-200 px-1 py-0.5 rounded">
                    {children}
                  </code>
                ),
                link: ({ value, children }) => (
                  <a
                    href={value?.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {children}
                  </a>
                ),
              },
              list: {
                bullet: ({ children }) => (
                  <ul className="list-disc pl-6 my-2">{children}</ul>
                ),
                number: ({ children }) => (
                  <ol className="list-decimal pl-6 my-2">{children}</ol>
                ),
              },
              block: {
                h2: ({ children }) => {
                  const text = children?.[0]; // Extract text from children array
                  return (
                    <h2
                      id={text}
                      className="font-actayWide text-xl sm:text-2xl xl:text-3xl 2xl:text-4xl font-bold mt-10 mb-4"
                    >
                      {text}
                    </h2>
                  );
                },
                h3: ({ children }) => {
                  const text = children?.[0];
                  return (
                    <h3
                      id={text}
                      className="text-sm sm:text-lg xl:text-xl 2xl:text-2xl mt-4"
                    >
                      {text}
                    </h3>
                  );
                },
                normal: ({ children }) => (
                  <p className="my-2 text-xs sm:text-sm xl:text-base 2xl:text-lg">
                    {children}
                  </p>
                ),
              },
            }}
          />
        </article>

      </div>
      <div className="flex items-center justify-center">
        <button onClick={() => router.push('/devhub')} 
          className="bg-white rounded-full my-16 px-4 sm:px-6 lg:px-8 py-3 lg:py-4 text-black mx-auto text-xs sm:text-sm lg:text-base"
        >
          Go Back to DevHub
        </button>
      </div>
    </div>
    </Layout>
  );
} 

export default DevhubItem; 