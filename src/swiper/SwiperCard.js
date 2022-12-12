import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./style.css";

const SwiperCard = ({ item }) => {
    const ratingRef = useRef(0);

    const [update, setUpdate] = useState(false);
    const clipPath = {
        clipPath: `inset(0 ${100 - ratingRef.current * 100}% 0 0)`,
    };

    useEffect(() => {
        if (item) {
            ratingRef.current = item?.stars / (item?.reviewers * 5);
            setUpdate(!update);
        }
    }, [item]);
    return (
        <div className="swiper_card_container">
            <Link className="swiper_card_wrap" to={`/${item?.slug}`}>
                <img src={item?.image} />
            </Link>
            <div className="swiper_card-infor_container">
                <Link className="swiper_text_container" to="/">
                    <div className="swiper_card-infor_title">
                        <span>{item?.title}</span>
                    </div>
                    <div className="swiper_card-infor_detail">
                        <div className="swiper_card-infor_chapter">
                            Chapter {item?.chapters?.length}
                        </div>
                        <div className="swiper_card-infor_star">
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <div
                                style={clipPath}
                                className="swiper_card-infor_rating"
                            >
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default SwiperCard;
