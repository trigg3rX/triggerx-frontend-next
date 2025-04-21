'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import logo from '../../assets/logo.svg';
import nav from '../../assets/nav.svg';
import leaderboardNav from '../../assets/leaderboardNav.svg';
import devhubNav from '../../assets/devhubNav.png';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [highlightStyle, setHighlightStyle] = useState({});
  const [prevRect, setPrevRect] = useState();
  const navRef = useRef();
  const isActiveRoute = (path) => pathname === path;
  const [isScrolled, setIsScrolled] = useState(false);
  const [navImage, setNavImage] = useState(nav);

  const handleMouseEnter = (event) => {
    const hoveredElement = event.currentTarget;
    if (!hoveredElement) return;
    const rect = hoveredElement.getBoundingClientRect();
    const navRect = navRef.current
      ? navRef.current.getBoundingClientRect()
      : { x: 0, y: 0, width: 0, height: 0 };

    setHighlightStyle({
      opacity: 1,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      transform: `translateX(${rect.x - navRect.x}px)`,
      transition: prevRect ? 'all 0.3s ease' : 'none',
    });

    setPrevRect(rect);
  };

  const handleMouseLeave = () => {
    setHighlightStyle((prev) => ({
      ...prev,
      opacity: 0,
      transition: 'all 0.3s ease',
    }));
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (pathname === '/leaderboard') {
      setNavImage(leaderboardNav);
    } else if (pathname === '/devhub') {
      setNavImage(devhubNav);
    } else {
      setNavImage(nav);
    }
  }, [pathname]);

  return (
    <div className="fixed top-0 left-0 right-0 w-full headerbg bg-[#0a0a0a]">
      <div className=" xl:w-[90%] md:w-[90%] mx-auto  justify-between my-10 header sm:hidden hidden lg:flex md:hidden items-center ">
        <div className=" ">
          <a href="https://www.triggerx.network/" target="blank">
            <Image
              src={logo}
              alt="TriggerX Logo"
              className="xl:w-full lg:w-[200px]"
              width={200}
              height={50}
              priority
            />
          </a>
        </div>
        <div className="relative flex flex-col items-center">
          <Image
            src={navImage}
            alt="Background Design"
            className="absolute z-0 h-auto lg:max-w-min lg:w-[500px] md:[200px]"
            width={500}
            height={200}
            style={{
              top: isScrolled ? -300 : -50,
              transition: 'top 0.7s ease',
            }}
            priority
          />

          <nav
            ref={navRef}
            className="relative bg-[#181818F0] rounded-xl z-10"
            onMouseLeave={handleMouseLeave}
          >
            <div
              className="absolute bg-gradient-to-r from-[#D9D9D924] to-[#14131324] rounded-xl border border-[#4B4A4A] "
              style={highlightStyle}
            />
            <div className="relative flex gap-3 xl:gap-5  ">
              <h4
                onMouseEnter={handleMouseEnter}
                onClick={() => {
                  router.push('/devhub');
                }}
                className={`text-center xl:w-[150px] lg:w-[130px]  lg:text-[12px] xl:text-base ${
                  isActiveRoute('/devhub')
                    ? 'bg-gradient-to-r from-[#D9D9D924] to-[#14131324] rounded-xl border border-[#4B4A4A]'
                    : 'transparent'
                }  px-7 py-3 rounded-xl cursor-pointer xl:text-base`}
              >
                Dev Hub
              </h4>

              <h4
                onMouseEnter={handleMouseEnter}
                onClick={() => {
                  router.push('/');
                }}
                className={`text-center xl:w-[150px] lg:w-[130px] xl:text-base lg:text-[12px]
                  ${
                    isActiveRoute('/')
                      ? 'bg-gradient-to-r from-[#D9D9D924] to-[#14131324] rounded-xl border border-[#4B4A4A]'
                      : 'transparent'
                  } px-7 py-3 rounded-xl cursor-pointer`}
              >
                Create Job
              </h4>
              <h4
                onMouseEnter={handleMouseEnter}
                onClick={() => router.push('/dashboard')}
                className={`text-center xl:w-[150px] lg:w-[130px]  lg:text-[12px] xl:text-base ${
                  isActiveRoute('/dashboard')
                    ? 'bg-gradient-to-r from-[#D9D9D924] to-[#14131324] rounded-xl border border-[#4B4A4A]'
                    : 'transparent'
                }
                 px-7 py-3 rounded-xl cursor-pointer`}
              >
                Dashboard
              </h4>
              <h4
                onMouseEnter={handleMouseEnter}
                onClick={() => {
                  router.push('/leaderboard');
                }}
                className={`text-center xl:w-[150px] lg:w-[130px]  lg:text-[12px] xl:text-base ${
                  isActiveRoute('/leaderboard')
                    ? 'bg-gradient-to-r from-[#D9D9D924] to-[#14131324] rounded-xl border border-[#4B4A4A]'
                    : 'transparent'
                }
                
              }  px-7 py-3 rounded-xl cursor-pointer xl:text-base`}
              >
                Leaderboard
              </h4>
            </div>
          </nav>
        </div>
        <div className="flex items-center">
          {' '}
          <ConnectButton chainStatus="icon" accountStatus="address" />
        </div>
      </div>
      <div className="w-[90%] mx-auto flex justify-between items-center my-10 header sm:flex  lg:hidden md:flex">
        <div
          className="absolute  left-1/2 transform -translate-x-1/2 -translate-y-10 z-0"
          style={{
            top: isScrolled ? -100 : 15,
            transition: 'top 0.7s ease',
          }}
        >
          <Image
            src={nav}
            alt="Nav"
            className="w-64 h-auto z-0"
            width={200}
            height={100}
            priority
          />
        </div>
        <div className="flex-shrink-0 relative z-10">
          <a href="https://www.triggerx.network/" target="blank">
            <Image src={logo} alt="Logo" width={120} height={120} priority />
          </a>
        </div>

        <div className="relative flex items-center gap-5">
          <div className="flex-shrink-0 relative z-10 ">
            <ConnectButton chainStatus="none" accountStatus="address" />
          </div>
          <div className="lg:hidden">
            <h4 onClick={() => setMenuOpen(!menuOpen)} className="text-white text-2xl">
              {menuOpen ? '✖' : '☰'}
            </h4>
            {menuOpen && (
              <div className="absolute top-full right-0 mt-3 bg-[#181818] p-4 rounded-md shadow-lg z-10 min-w-[200px]">
                <div className="flex flex-col gap-4 text-white ">
                  <h4
                    onClick={() => {
                      router.push('/devhub');
                      setMenuOpen(false);
                    }}
                    className={`w-full 
                         
                        ${
                          isActiveRoute('/devhub') ? 'text-white' : 'text-gray-400'
                        }  px-7 py-3 rounded-xl cursor-pointer`}
                  >
                    Dev Hub
                  </h4>

                  <h4
                    onClick={() => {
                      router.push('/');
                      setMenuOpen(false);
                    }}
                    className={`w-full ${
                      isActiveRoute('/') ? 'text-white' : 'text-gray-400'
                    }  px-7 py-3 rounded-xl cursor-pointer`}
                  >
                    Create Job
                  </h4>
                  <h4
                    onClick={() => {
                      router.push('/dashboard');
                      setMenuOpen(false);
                    }}
                    className={` w-full  ${
                      isActiveRoute('/dashboard') ? 'text-white' : 'text-gray-400'
                    }  px-7 py-3 rounded-xl cursor-pointer`}
                  >
                    Dashboard
                  </h4>
                  <h4
                    onClick={() => {
                      router.push('/leaderboard');
                      setMenuOpen(false);
                    }}
                    className={` w-full  ${
                      isActiveRoute('/leaderboard') ? 'text-white' : 'text-gray-400'
                    }  px-7 py-3 rounded-xl cursor-pointer`}
                  >
                    Leaderboard
                  </h4>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
