import React from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";

const DefaultLayout = ({ children }) => {
    return (
        <div className="default_container">
            <div className="header_container">
                <Header />
            </div>
            {children}
            <div className="footer_container">
                <Footer />
            </div>
        </div>
    );
};

export default DefaultLayout;
