import axios from "axios";
import React, { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import HomeIcons from "../components/another/HomeIcons";
import "./style.css";
const ActiveForgotPassword = () => {
    const navigate = useNavigate();

    const passforgotRef = useRef();
    const repassforgotRef = useRef();

    const { slug } = useParams();

    const handleAppearing = (e) => {
        if (e.target?.checked) {
            passforgotRef.current.type = "text";
            repassforgotRef.current.type = "text";
        } else {
            passforgotRef.current.type = "password";
            repassforgotRef.current.type = "password";
        }
    };

    const handleChangePassword = async () => {
        const pass = passforgotRef.current.value;
        const repass = repassforgotRef.current.value;
        if (pass !== repass) {
            return toast.error("Mật khẩu không khớp.");
        }
        if (pass.length < 8) {
            return toast.error("Mật khẩu cần lớn hơn 8 ký tự.");
        }
        try {
            const data = await axios.post(
                `/api/auth/change_password`,
                {
                    password: pass,
                },
                {
                    headers: {
                        token: `Bearer ${slug}`,
                    },
                }
            );
            toast.success(data?.data?.msg);
            navigate("/");
        } catch (err) {
            return toast.error(err?.response?.data?.msg);
        }
    };
    return (
        <div className="login_container">
            <div className="login_wrap">
                <div className="login_title">
                    <h1>Đổi Mật Khẩu</h1>
                </div>
                <div className="login_input_container">
                    <label>Nhập mật khẩu mới:</label>
                    <input
                        ref={passforgotRef}
                        type="password"
                        name="password"
                        placeholder="Nhập mật khẩu"
                    />
                </div>
                <div className="login_input_container">
                    <label>Nhập lại mật khẩu mới:</label>
                    <input
                        ref={repassforgotRef}
                        type="password"
                        name="password"
                        placeholder="Nhập lại mật khẩu"
                    />
                </div>
                <div className="appearPassword">
                    <label htmlFor="appearing">Hiển thị mật khẩu?</label>
                    <input
                        onChange={(e) => handleAppearing(e)}
                        id="appearing"
                        type="checkbox"
                    />
                </div>
                <div className="login_button_container">
                    <button onClick={handleChangePassword}>Đổi mật khẩu</button>
                </div>
            </div>
            <HomeIcons />
        </div>
    );
};

export default ActiveForgotPassword;
