import React, { useEffect, useRef, useState } from "react";
import "./style.css";
const ScrollTop = () => {
    const [checkUp, setCheckUp] = useState(true);

    const currentPoRef = useRef(0);
    useEffect(() => {
        window.onscroll = () => {
            if (window.pageYOffset === 0) {
                setCheckUp(true);
            } else {
                setCheckUp(false);
            }
        };
    });
    return (
        <div
            title="Quý khách xin vui lòng đeo dây an toàn."
            onClick={() => {
                if (!checkUp) {
                    currentPoRef.current = window.pageYOffset;
                    window.scrollTo(0, 0);
                } else {
                    window.scrollTo(0, currentPoRef.current);
                }
            }}
            className="scroll-top_container"
        >
            <i
                style={checkUp ? { transform: " rotateZ(180deg)" } : {}}
                className="fa-solid fa-plane-up"
            ></i>
        </div>
    );
};

export default ScrollTop;
