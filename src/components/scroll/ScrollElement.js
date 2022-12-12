import React from "react";
import "./style.css";
const ScrollElement = ({ elementRef }) => {
    return (
        <div
            title="Quý khách xin vui lòng đeo dây an toàn."
            onClick={() => {
                if (elementRef.current) {
                    elementRef.current.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }
            }}
            className="scroll-top_container"
        >
            <i className="fa-solid fa-plane-up"></i>
        </div>
    );
};

export default ScrollElement;
