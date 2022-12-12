import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import localStorage from "redux-persist/es/storage";
import { UserContext } from "../App";
import Card from "../card/Card";
import "./style.css";
const UserRead = () => {
    const auth = useSelector((state) => state.auth);

    const [cards, setCards] = useState([]);

    const { checkToken, cache } = useContext(UserContext);

    const getuserProfile = async () => {
        const da = (await checkToken()) || auth.user?.accessToken;
        const url = "/api/auth/user/profile";
        if (cache.current[url]) {
            return setCards(cache.current[url]?.user?.reads);
        }
        try {
            const data = await axios.get(url, {
                headers: {
                    token: `Bearer ${da}`,
                },
            });
            setCards(data?.data?.user?.reads);
        } catch (err) {
            return toast.error(err?.response?.data?.msg);
        }
    };

    useEffect(() => {
        let here = true;
        if (auth.user?.accessToken) {
            getuserProfile();
        } else {
            localStorage.getItem("likes").then((res) => {
                if (res !== null) {
                    const likesArr = JSON.parse(res);
                    setCards(likesArr);
                }
            });
        }
        return () => {
            here = false;
        };
    }, []);
    return (
        <div className="user_follow_container">
            <div className="grid wideS">
                <div className="user_follow_wrap">
                    <div className="user_follow_title">
                        <h1>Truyện Đã Đọc</h1>
                    </div>
                    <div className="user_follow_card">
                        <div className="row">
                            {cards?.map((item, index) => (
                                <div
                                    key={item?._id + "CardToShow" + index}
                                    className="col c-6 m-3 l-2-4"
                                >
                                    <Card item={item?.readId} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserRead;
