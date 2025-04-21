'use client';

import React, { useState, useEffect } from "react";
import sanityClient from "../../lib/sanity"; 
import { FaArrowUp } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Head from 'next/head';
import Layout from "@/components/layout/Layout";
import DevHubLoading from "./loading";

const query = `*[_type == "post"] | order(_createdAt desc) {
  _id,     
  title,
  slug {
    current  
  },
  image {
    asset-> { 
      _id,    
      url
    }
  }
}`;

function Devhub() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const baseUrl = 'https://app.triggerx.network';

  useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true);
      setError(null);
      try {
        console.log("Fetching posts from Sanity...");
        const fetchedPosts = await sanityClient.fetch(query);
        console.log("Sanity fetch successful:", fetchedPosts);

        if (!Array.isArray(fetchedPosts)) {
          console.warn(
            "Sanity fetch did not return an array. Result:",
            fetchedPosts
          );
          setPosts([]);
        } else {
          setPosts(fetchedPosts);
        }
      } catch (err) {
        console.error("Error fetching posts from Sanity:", err);
        setError(err);
      } finally {
        setIsLoading(false);
        console.log("Finished fetching attempt.");
      }
    }

    fetchPosts();
  }, []);

  if (isLoading) {
    return <DevHubLoading />;
  }

  // Use the error state to display an error message
  if (error) {
    console.error("Rendering error state:", error);
    return (
      <div>
        Oops! We encountered an issue fetching data. Please try again later.
        Error: {error.message}
      </div>
    );
  }

  // Handle the case where the fetch was successful but returned no posts
  if (!isLoading && posts.length === 0) {
    return <div>No dev posts found.</div>;
  }

  const handleItemClick = (slug) => {
    if (!slug) {
      console.warn("Cannot navigate without a slug.");
      return;
    }

    router.push(`/devhub/${slug}`);
  };

  return (
    <Layout>
      <Head>
        <title>TriggerX | Devhub</title>
        <meta name="description" content="Automate Tasks Effortlessly" />
        <meta property="og:title" content="TriggerX | Devhub" />
        <meta property="og:description" content="Automate Tasks Effortlessly" />
        <meta property="og:image" content={`${baseUrl}/images/devhub-og.png`} />
        <meta property="og:url" content={`${baseUrl}/devhub`} />
        <meta name="twitter:title" content="TriggerX | Devhub" />
        <meta name="twitter:description" content="Automate Tasks Effortlessly" />
        <meta name="twitter:image" content={`${baseUrl}/images/devhub-og.png`} />
      </Head>
      <div className="min-h-screen md:mt-[20rem] mt-[10rem] w-[90%] mx-auto">
        <div className="w-full flex items-center justify-between">
          <h4 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-left px-4 mb-8 flex items-center gap-3">
            Total{" "}
            <span className="text-[#FBF197] text-[25px]">
              {" "}
              {` { ${posts.length} } `}
            </span>
          </h4>

          <button onClick={() => router.push('/api')} className="relative bg-[#222222] text-black border border-black px-6 py-2 sm:px-8 sm:py-3 rounded-full group transition-transform">
            <span className="absolute inset-0 bg-[#222222] border border-[#FFFFFF80]/50 rounded-full scale-100 translate-y-0 transition-all duration-300 ease-out group-hover:translate-y-2"></span>
            <span className="absolute inset-0 bg-white rounded-full scale-100 translate-y-0 group-hover:translate-y-0"></span>
            <span className="font-actayRegular relative z-10 px-0 py-3 sm:px-3 md:px-6 lg:px-2 rounded-full translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out text-xs sm:text-base">
            API Services
            </span>
          </button>
        </div>
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 mb-40">
            {posts.map((item) => {
              const currentSlug = item?.slug?.current;
              return (
                <div
                  key={item._id}
                  onClick={() => handleItemClick(currentSlug)}
                  role="link"
                  tabIndex={0}
                  className="rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-[#0F0F0F] p-3 border border-[#5F5F5F] flex flex-col justify-between cursor-pointer group"
                >
                  <div className="w-full h-[200px] rounded-lg border border-[#5F5F5F] relative overflow-hidden">
                    {item.image?.asset?.url ? (
                      <img
                        src={item.image.asset.url}
                        alt={item.title}
                        className="h-full w-auto object-cover"
                      />
                    ) : (
                      <div className="w-full h-[200px] rounded-lg border border-[#5F5F5F] relative overflow-hidden">
                        <span>No Image</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col ml-3">
                    <h2 className="font-actayWide text-base sm:text-xl transition-colors mt-4 sm:mt-8">
                      {item.title}
                    </h2>

                    <div className="flex items-center justify-center text-[#B7B7B7] group-hover:text-white py-5 rounded-lg w-max text-xs sm:text-sm ">
                      Read User Guide
                      <FaArrowUp className="ml-2 transform rotate-[45deg] group-hover:translate-x-[2px] transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Devhub;
