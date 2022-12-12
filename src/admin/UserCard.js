import axios from "axios";
import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { UserContext } from "../App";
import { isFailing, isLoading, isSuccess } from "../redux/slice/auth";
import "./style.css";
const UserCard = ({ item, setUpdate, update }) => {
    const { checkToken } = useContext(UserContext);

    const dispatch = useDispatch();

    const auth = useSelector((state) => state.auth);

    const handleDeleteUser = async () => {
        const check = window.confirm(`Bạn có thực sự muốn xóa ${item?.name} ?`);
        if (check) {
            const da = (await checkToken()) || auth.user?.accessToken;
            dispatch(isLoading());
            try {
                const data = await axios.delete(
                    `/api/auth/account/delete/${item?._id}`,
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
                return toast.error(err?.response?.data?.msg);
            }
        }
    };
    return (
        <div className="userCard_container">
            <div className="userCard_image">
                <img src={item?.image} />
            </div>
            <div className="userCard_name">
                <i>{item?.name}</i>
            </div>
            <div className="userCard_email">
                <b>{item?.email}</b>
            </div>
            <div className="userCard_times">
                <i
                    onClick={handleDeleteUser}
                    className="fa-regular fa-circle-xmark"
                ></i>
            </div>
        </div>
    );
};

export default UserCard;
