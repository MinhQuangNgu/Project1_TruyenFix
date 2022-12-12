import React from "react";
import "./style.css";
const HeaderSliceD = ({ headerSlice, setHeaderSlice }) => {
    return (
        <div
            onClick={() => {
                setHeaderSlice(false);
            }}
            className={
                headerSlice
                    ? "header_slice_dis_container header_slice_dis_container_a"
                    : "header_slice_dis_container header_slice_dis_container_d"
            }
        ></div>
    );
};

export default HeaderSliceD;
