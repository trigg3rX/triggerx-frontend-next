import React from 'react';
import Header from '../ui/Header';
import Footer from '../ui/Footer';

const Layout = ({ children }) => {
  return (
    <div className="">
      <div className="relative z-50">
        <Header />
      </div>
      <div className="relative z-30"> {children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
