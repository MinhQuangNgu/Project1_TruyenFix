import axios from "axios";
import React, { useContext } from "react";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../App";
import HomeIcons from "../components/another/HomeIcons";
import NotFound from "../notfound/NotFound";
import "./style.css";
const ChangePassword = () => {
    const auth = useSelector((state) => state.auth);

    const { checkToken } = useContext(UserContext);

    const navigate = useNavigate();

    const passforgotRef = useRef();
    const repassforgotRef = useRef();

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
        const check = window.confirm(
            "Bạn có muốn thay đổi mật khẩu hay không? Nếu bạn đang đăng nhập bằng facebook hoặc google thì vào lần đăng nhập sau bạn sẽ không thể đăng nhập bằng google và facebook được nữa mà bạn phải nhập trực tiếp tài khoản và mật khẩu."
        );
        if (check) {
            const da = (await checkToken()) || auth.user?.accessToken;
            try {
                const data = await axios.post(
                    `/api/auth/change_password`,
                    {
                        password: pass,
                    },
                    {
                        headers: {
                            token: `Bearer ${da}`,
                        },
                    }
                );

                toast.success(data?.data?.msg);
                navigate("/");
            } catch (err) {
                return toast.error(err?.response?.data?.msg);
            }
        }
    };

    return (
        <>
            {auth.user?.accessToken ? (
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
                            <label htmlFor="appearing">
                                Hiển thị mật khẩu?
                            </label>
                            <input
                                onChange={(e) => handleAppearing(e)}
                                id="appearing"
                                type="checkbox"
                            />
                        </div>
                        <div className="login_button_container">
                            <button onClick={handleChangePassword}>
                                Đổi mật khẩu
                            </button>
                        </div>
                    </div>
                    <HomeIcons />
                </div>
            ) : (
                <NotFound />
            )}
        </>
    );
};

export default ChangePassword;
