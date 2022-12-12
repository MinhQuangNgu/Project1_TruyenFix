import axios from "axios";
import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import HomeIcons from "../components/another/HomeIcons";
import { isFailing, isLoading, isLogin, isSuccess } from "../redux/slice/auth";
import "./style.css";
const Register = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const rePasswordRef = useRef();
    const nameRef = useRef();
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const handleRegister = async () => {
        const user = {
            email: emailRef.current?.value,
            password: passwordRef.current?.value,
            name: nameRef.current?.value,
            rePassword: rePasswordRef.current?.value,
        };
        if (!user.email || !user.password || !user.name || !user.rePassword) {
            return toast.error("Vui lòng điề hết thông tin.");
        }
        if (user.password.length < 8) {
            return toast.error("Mật khẩu cần lớn hơn 8 ký tự.");
        }
        if (user.password !== user.rePassword) {
            return toast.error("Mật khẩu không khớp.");
        }
        dispatch(isLoading());
        try {
            const data = await axios.post("/api/auth/register", {
                ...user,
            });
            toast.success(data?.data?.msg);
            dispatch(isSuccess());
            navigate("/login");
        } catch (err) {
            dispatch(isFailing());
            toast.error(err?.response?.data?.msg);
        }
    };

    const handleAppearing = (e) => {
        if (e.target?.checked) {
            document.getElementById("pass").type = "text";
            document.getElementById("repass").type = "text";
        } else {
            document.getElementById("pass").type = "password";
            document.getElementById("repass").type = "password";
        }
    };

    const handleRegisterGoogle = async (response) => {
        dispatch(isLoading());
        try {
            const data = await axios.post("/api/auth/google/register", {
                clientId: response.client_id,
                token: response.credential,
            });
            toast.success(data?.data?.msg);
            dispatch(isLogin(data?.data));
            navigate("/");
        } catch (err) {
            dispatch(isFailing());
            toast.error(err?.response?.data?.msg);
        }
    };

    const handleLoginFacebook = () => {
        window.FB.login(
            function (response) {
                dispatch(isLoading());
                const data = axios
                    .post("/api/auth/facebook/register", {
                        userId: response?.authResponse?.userID,
                        token: response?.authResponse?.accessToken,
                    })
                    .then((res) => {
                        toast.success(res?.data?.msg);
                        dispatch(isLogin(res?.data));
                        navigate("/");
                    })
                    .catch((err) => {
                        dispatch(isFailing());
                        toast.error(err?.response?.data?.msg);
                    });
            },
            { scope: "email" }
        );
    };

    useEffect(() => {
        window.fbAsyncInit = function () {
            window.FB.init({
                appId: "647646060186725",
                cookie: true,
                xfbml: true,
                version: "v14.0",
            });

            window.FB.AppEvents.logPageView();
        };

        (function (d, s, id) {
            var js,
                fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        })(document, "script", "facebook-jssdk");
    }, []);
    useEffect(() => {
        window.google?.accounts?.id?.initialize({
            client_id:
                "971862418301-k2jse3ca3e6fooeo4c4op1a9e50gt5go.apps.googleusercontent.com",
            callback: handleRegisterGoogle,
        });
        window.google?.accounts?.id?.renderButton(
            document.getElementById("login_google"),
            {
                theme: "outline",
                size: "medium",
            }
        );
        window.google?.accounts?.id?.prompt();
    }, [window.google?.accounts]);
    return (
        <div className="login_container">
            <div className="login_wrap">
                <div className="login_title">
                    <h1>Đăng Ký</h1>
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
                <div className="login_input_container">
                    <label>Tên hiển thị:</label>
                    <input
                        ref={nameRef}
                        type="text"
                        name="name"
                        placeholder="Nhập tên hiển thị"
                    />
                </div>
                <div className="login_input_container">
                    <label>Mật khẩu:</label>
                    <input
                        ref={passwordRef}
                        type="password"
                        name="Password"
                        id="pass"
                        placeholder="Nhập mật khẩu"
                    />
                </div>
                <div className="login_input_container">
                    <label>Nhập Lại Mật khẩu:</label>
                    <input
                        ref={rePasswordRef}
                        type="password"
                        name="re-Password"
                        id="repass"
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
                    <button onClick={handleRegister}>Đăng Ký</button>
                </div>
                <div className="login_register">
                    Bạn đã có tài khoản
                    <Link
                        style={{ color: "white" }}
                        className="login_register_button"
                        to="/login"
                    >
                        Đăng nhập?
                    </Link>
                </div>
                <div className="Login_another">
                    <div id="login_google"></div>
                    <div id="loginFacebook">
                        <button onClick={handleLoginFacebook}>
                            <i
                                style={{ marginRight: "0.3rem" }}
                                className="fa-brands fa-facebook"
                            ></i>
                            Đăng Nhập Bằng Facebook
                        </button>
                    </div>
                </div>
            </div>
            <HomeIcons />
        </div>
    );
};

export default Register;
