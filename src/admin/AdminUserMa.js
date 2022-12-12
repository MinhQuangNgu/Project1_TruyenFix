import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { isFailing, isLoading, isSuccess } from "../redux/slice/auth";
import "./style.css";
import UserCard from "./UserCard";
const AdminUserMa = () => {
    const [users, setUsers] = useState([]);

    const [update, setUpdate] = useState(false);

    const auth = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        let here = true;
        dispatch(isLoading());
        axios
            .get("/api/auth/user/all", {
                headers: {
                    token: `Bearer ${auth.user?.accessToken}`,
                },
            })
            .then((res) => {
                dispatch(isSuccess());
                if (!here) {
                    return;
                }
                setUsers(res?.data?.users);
            })
            .catch((err) => {
                dispatch(isFailing());
                if (!here) {
                    return;
                }
                toast.error(err?.response?.data?.msg);
            });
        return () => {
            here = false;
        };
    }, [update]);
    return (
        <div className="admin_user_manager_container">
            <div className="grid wideS">
                <div className="admin_user_manager_wrap">
                    <div className="admin_user_manager_title">
                        <h1>Quản lý người dùng</h1>
                    </div>
                    <div className="admin_user_manager_cards">
                        <div className="row">
                            {users?.map((item) => (
                                <div
                                    key={item?._id + "UserCard"}
                                    className="col c-6 m-4 l-4"
                                >
                                    <UserCard
                                        setUpdate={setUpdate}
                                        update={update}
                                        item={item}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUserMa;
