import React from "react";
import "./style.css";
const Loading = () => {
    return (
        <div className="loading_container">
            <div className="loader">
                <div
                    style={{ borderColor: "white" }}
                    className="inner one"
                ></div>
                <div style={{ borderColor: "red" }} className="inner two"></div>
                <div className="inner three"></div>
            </div>
        </div>
    );
};

export default Loading;
