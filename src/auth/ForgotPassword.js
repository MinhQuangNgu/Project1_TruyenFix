import axios from "axios";
import React, { useRef } from "react";
import { toast } from "react-toastify";
import HomeIcons from "../components/another/HomeIcons";
import "./style.css";
const ForgotPassword = () => {
    const emailRef = useRef();

    const handleGetPassword = async () => {
        const email = emailRef.current?.value;
        if (!email) {
            return toast.error("Vui lòng nhập email.");
        }
        try {
            const data = await axios.post("/api/auth/forgot", {
                email,
            });

            toast.success(data?.data?.msg);
        } catch (err) {
            return toast.error(err?.response?.data?.msg);
        }
    };

    return (
        <div className="login_container">
            <div className="login_wrap">
                <div className="login_title">
                    <h1>Quên Mật Khẩu</h1>
                </div>
                <div className="login_input_container">
                    <label>Email:</label>
                    <input
                        ref={emailRef}
                        type="text"
                        name="email"
                        placeholder="Nhập Email"
                    />
                </div>
                <div className="login_button_container">
                    <button onClick={handleGetPassword}>
                        Lấy Lại Mật Khẩu
                    </button>
                </div>
            </div>
            <HomeIcons />
        </div>
    );
};

export default ForgotPassword;
