import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { isLogOut } from "../../redux/slice/auth";
import "./style.css";
const HeaderSliceA = ({ headerSlice, setHeaderSlice, kinds, countries }) => {
    const auth = useSelector((state) => state.auth);

    const [child, setChild] = useState(false);

    const [kindChild, setkindChild] = useState(false);

    const [countryChild, setCountryChild] = useState(false);

    const dispatch = useDispatch();

    return (
        <div
            className={
                headerSlice
                    ? "header_slice_container header_slice_container_a"
                    : "header_slice_container header_slice_container_d"
            }
        >
            <div className="header_slice_wrap">
                <div className="header_slice_times">
                    <i
                        onClick={() => {
                            setHeaderSlice(false);
                        }}
                        style={{ cursor: "pointer" }}
                        className="fa-regular fa-circle-xmark"
                    ></i>
                </div>
                {auth.user?.accessToken ? (
                    <div className="header_slice_auth">
                        <div
                            onClick={() => {
                                setChild(!child);
                            }}
                            className="header_slice_auth_exist"
                        >
                            <div className="header_slice_auth_detail">
                                <img src={auth.user?.image} />
                                <div className="header_slice_auth_detail_name">
                                    <p>{auth.user?.name}</p>
                                </div>
                            </div>
                            <div className="header_slice_angle_down">
                                {child ? (
                                    <i className="fa-solid fa-angle-up"></i>
                                ) : (
                                    <i className="fa-solid fa-angle-down"></i>
                                )}
                            </div>
                        </div>
                        {child && (
                            <div className="header_slice_auth_exist_child">
                                <Link
                                    className="header_slice_link"
                                    to="/user/manager"
                                >
                                    <div
                                        onClick={() => {
                                            setHeaderSlice(false);
                                        }}
                                        className="header_slice_auth_items_child"
                                    >
                                        Thông tin
                                    </div>
                                </Link>
                            </div>
                        )}
                        {child && (
                            <div className="header_slice_auth_exist_child">
                                <Link
                                    className="header_slice_link"
                                    to="/auth/change_password"
                                >
                                    <div
                                        onClick={() => {
                                            setHeaderSlice(false);
                                        }}
                                        className="header_slice_auth_items_child"
                                    >
                                        Đổi mật khẩu
                                    </div>
                                </Link>
                            </div>
                        )}
                        {child && (
                            <div className="header_slice_auth_exist_child">
                                <div
                                    onClick={() => {
                                        dispatch(isLogOut());
                                        setHeaderSlice(false);
                                        toast.success("Đăng xuất thành công.");
                                    }}
                                    className="header_slice_auth_items_child"
                                >
                                    Đăng xuất
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="header_slice_auth">
                        <div className="header_slice_auth_exist">
                            <Link className="header_slice_link" to="/login">
                                <div
                                    onClick={() => {
                                        setHeaderSlice(false);
                                    }}
                                    className="header_slice_auth_items"
                                >
                                    Đăng nhập
                                </div>
                            </Link>
                        </div>
                        <div className="header_slice_auth_exist">
                            <Link className="header_slice_link" to="/register">
                                <div
                                    onClick={() => {
                                        setHeaderSlice(false);
                                    }}
                                    className="header_slice_auth_items"
                                >
                                    Đăng ký
                                </div>
                            </Link>
                        </div>
                    </div>
                )}
                <div className="header_slice_auth">
                    <div className="header_slice_auth_exist">
                        <Link
                            className="header_slice_link"
                            to="/user/truyen-theo-doi"
                        >
                            <div
                                onClick={() => {
                                    setHeaderSlice(false);
                                }}
                                className="header_slice_auth_items"
                            >
                                Truyện Theo Dõi
                            </div>
                        </Link>
                    </div>
                    <div className="header_slice_auth_exist">
                        <Link
                            className="header_slice_link"
                            to="/user/truyen-da-doc"
                        >
                            <div
                                onClick={() => {
                                    setHeaderSlice(false);
                                }}
                                className="header_slice_auth_items"
                            >
                                Truyện Đã Đọc
                            </div>
                        </Link>
                    </div>
                    <div className="header_slice_auth_exist">
                        <Link
                            className="header_slice_link"
                            to="/tim-kiem?sort=-watchs"
                        >
                            <div
                                onClick={() => {
                                    setHeaderSlice(false);
                                }}
                                className="header_slice_auth_items"
                            >
                                Truyện Top
                            </div>
                        </Link>
                    </div>
                    <div className="header_slice_auth_exist">
                        <Link className="header_slice_link" to="/tim-kiem">
                            <div
                                onClick={() => {
                                    setHeaderSlice(false);
                                }}
                                className="header_slice_auth_items"
                            >
                                Truyện mới nhất
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="header_slice_auth">
                    <div
                        onClick={() => {
                            setkindChild(!kindChild);
                        }}
                        className="header_slice_auth_exist"
                    >
                        <div className="header_slice_auth_detail">
                            <div className="header_slice_auth_detail_name">
                                <p>Thể loại</p>
                            </div>
                        </div>
                        <div className="header_slice_angle_down">
                            {child ? (
                                <i className="fa-solid fa-angle-up"></i>
                            ) : (
                                <i className="fa-solid fa-angle-down"></i>
                            )}
                        </div>
                    </div>
                    {kindChild &&
                        kinds?.map((item) => (
                            <div
                                key={item?._id + "kindsHere"}
                                className="header_slice_auth_exist_child"
                            >
                                <Link
                                    className="header_slice_link"
                                    to={`/tim-kiem?kind=${item?.slug}`}
                                >
                                    <div
                                        onClick={() => {
                                            setHeaderSlice(false);
                                        }}
                                        className="header_slice_auth_items_child"
                                    >
                                        {item?.name}
                                    </div>
                                </Link>
                            </div>
                        ))}
                </div>
                <div className="header_slice_auth">
                    <div
                        onClick={() => {
                            setCountryChild(!countryChild);
                        }}
                        className="header_slice_auth_exist"
                    >
                        <div className="header_slice_auth_detail">
                            <div className="header_slice_auth_detail_name">
                                <p>Quốc gia</p>
                            </div>
                        </div>
                        <div className="header_slice_angle_down">
                            {child ? (
                                <i className="fa-solid fa-angle-up"></i>
                            ) : (
                                <i className="fa-solid fa-angle-down"></i>
                            )}
                        </div>
                    </div>
                    {countryChild &&
                        countries?.map((item) => (
                            <div
                                key={item?._id + "countriesHere"}
                                className="header_slice_auth_exist_child"
                            >
                                <Link
                                    className="header_slice_link"
                                    to={`/tim-kiem?country=${item?.slug}`}
                                >
                                    <div
                                        onClick={() => {
                                            setHeaderSlice(false);
                                        }}
                                        className="header_slice_auth_items_child"
                                    >
                                        {item?.name}
                                    </div>
                                </Link>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default HeaderSliceA;
