import React, { useEffect, useRef, useState } from "react";
import "./style.css";
const ImageWatch = ({ url }) => {
    const imgRef = useRef(null);

    const [loadSuccess, setLoadSuccess] = useState(false);

    const [loadType, setLoadType] = useState(false);

    useEffect(() => {
        if (loadSuccess) {
            return;
        }
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                imgRef.current.src = url;
                setLoadSuccess(true);
            }
        });

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }
        return () => {
            if (imgRef.current) {
                observer.disconnect();
            }
        };
    }, [imgRef.current]);

    const handleLoading = () => {
        setLoadType(true);
    };

    return (
        <div className="movie_watch_image_items">
            <img ref={imgRef} onLoad={handleLoading} />
            {!loadType && (
                <div className="loader">
                    <div className="inner one"></div>
                    <div className="inner two"></div>
                    <div className="inner three"></div>
                </div>
            )}
        </div>
    );
};

export default ImageWatch;
