import React from "react";
import { Link } from "react-router-dom";
import "./style.css";
const HomeIcons = () => {
    return (
        <div className="home_icon_container">
            <Link style={{ textDecoration: "none" }} to="/">
                <div title="Trang chủ" className="home_icon_wrap">
                    <i className="fa-solid fa-house"></i>
                </div>
            </Link>
        </div>
    );
};

export default HomeIcons;
