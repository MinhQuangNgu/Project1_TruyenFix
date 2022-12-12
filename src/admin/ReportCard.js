import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { UserContext } from "../App";
import { isFailing, isLoading, isSuccess } from "../redux/slice/auth";
import "./style.css";
const ReportCard = ({ item, update, setUpdate }) => {
    const contentRef = useRef();

    const dispatch = useDispatch();

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.innerHTML = item?.comment?.content;
        }
    }, [item]);

    const { checkToken } = useContext(UserContext);
    const auth = useSelector((state) => state.auth);

    const handleDeleteComment = async () => {
        const check = window.confirm(`Bạn có thực sự muốn xóa bình luận này?`);
        if (check) {
            const da = (await checkToken()) || auth.user?.accessToken;
            dispatch(isLoading());
            try {
                const data = await axios.delete(
                    `/api/message/delete/admin/${item?.comment?._id}`,
                    {
                        headers: {
                            token: `Bearer ${da}`,
                        },
                    }
                );
                dispatch(isSuccess());
                toast.success(data?.data?.msg);
            } catch (err) {
                dispatch(isFailing());
                toast.error(err?.response?.data?.msg);
            }
        }
    };

    const handleReport = async () => {
        const check = window.confirm(`Bạn có thực sự muốn xóa bình luận này?`);
        if (check) {
            const da = (await checkToken()) || auth.user?.accessToken;
            dispatch(isLoading());
            try {
                const data = await axios.delete(
                    `/api/report/delete/${item?._id}`,
                    {
                        headers: {
                            token: `Bearer ${da}`,
                        },
                    }
                );
                dispatch(isSuccess());
                toast.success(data?.data?.msg);
                setUpdate(!update);
            } catch (err) {
                dispatch(isFailing());
                toast.error(err?.response?.data?.msg);
            }
        }
    };

    const handleDeleteAccount = async () => {
        const check = window.confirm(`Bạn có thực sự muốn xóa tài khoản này?`);
        if (check) {
            const da = (await checkToken()) || auth.user?.accessToken;
            dispatch(isLoading());
            try {
                const data = await axios.delete(
                    `/api/auth/account/delete/${item?.to?._id}`,
                    {
                        headers: {
                            token: `Bearer ${da}`,
                        },
                    }
                );
                dispatch(isSuccess());
                toast.success(data?.data?.msg);
            } catch (err) {
                dispatch(isFailing());
                toast.error(err?.response?.data?.msg);
            }
        }
    };

    return (
        <div className="reportCard_container">
            <div className="reportCard_from">
                <h1>{item?.number} lần</h1>
                <img src={item?.to?.image} />
                <span>{item?.to?.name}</span>
            </div>
            <div className="report_icons">
                <button onClick={handleDeleteComment}>Xóa bình luận</button>
                <i
                    style={{
                        width: "100%",
                        textAlign: "center",
                    }}
                    className="fa-solid fa-arrow-right"
                ></i>
                <button onClick={handleDeleteAccount}>Xóa tài khoản</button>
            </div>
            <div className="reportCard_to">
                <div className="reportCard_comment">
                    <div
                        ref={contentRef}
                        className="reportCard_comment_detail"
                    ></div>
                </div>
            </div>
            <div className="delete_reportCard">
                <i
                    onClick={handleReport}
                    className="fa-regular fa-circle-xmark"
                ></i>
            </div>
        </div>
    );
};

export default ReportCard;
