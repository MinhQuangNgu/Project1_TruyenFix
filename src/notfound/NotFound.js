import React from "react";
import { Link } from "react-router-dom";
import "./style.css";
const NotFound = () => {
    return (
        <div className="notfound_container">
            <h1 className="errorH1">Lỗi hiển thị trang</h1>
            <p style={{ color: "#bbb" }} className="zoom-area">
                Trang bạn tìm không hề tồn tại
            </p>
            <section className="error-container">
                <span className="four">
                    <span className="screen-reader-text">4</span>
                </span>
                <span className="zero">
                    <span className="screen-reader-text">0</span>
                </span>
                <span className="four">
                    <span className="screen-reader-text">4</span>
                </span>
            </section>
            <div className="link-container">
                <Link to="/" className="more-link">
                    Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
