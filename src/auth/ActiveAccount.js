import axios from "axios";
import React, { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "./style.css";
const ActiveAccount = () => {
    const { slug } = useParams();

    const navigate = useNavigate();

    const countRef = useRef(1);

    const activeAccount = async () => {
        try {
            const data = await axios.post("/api/auth/active", {
                token: slug,
            });
            toast.success(data?.data?.msg);
        } catch (err) {
            toast.error(err?.response?.data?.msg);
        }
    };

    useEffect(() => {
        if (countRef.current % 2 === 1) {
            activeAccount();
            navigate("/login");
        }
        return () => {
            countRef.current++;
        };
    }, [slug]);
    return <div>Kích hoạt tài khoản thành công.</div>;
};

export default ActiveAccount;
