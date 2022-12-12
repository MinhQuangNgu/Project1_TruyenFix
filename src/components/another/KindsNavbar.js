import React from "react";
import { Link } from "react-router-dom";

const KindsNavbar = ({ name, slug, item }) => {
    return (
        <li style={{ cursor: "arrow" }}>
            <span className="navbar_item-infor">
                {name}
                <i className="fa-solid fa-sort-down kinds_icons"></i>
            </span>
            <ul className="navbar_item-kinds_container">
                {item?.map((item, index) => (
                    <Link
                        key={item?._id + "KindsNow" + index}
                        className="navbar_item-kinds_items"
                        to={`${slug + item?.slug}`}
                    >
                        <li>{item?.name}</li>
                    </Link>
                ))}
            </ul>
        </li>
    );
};

export default KindsNavbar;
