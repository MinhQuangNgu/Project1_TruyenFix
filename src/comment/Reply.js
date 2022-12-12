import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../App";
import "./style.css";
const Reply = ({ name, setReply, item }) => {
    const { socket, checkToken } = useContext(UserContext);

    const [content, setContent] = useState("");

    const { slug } = useParams();

    const auth = useSelector((state) => state.auth);

    const handleCreateReply = async () => {
        if (!document.getElementById("commentContentReply").innerHTML) {
            return toast.error("Vui lòng điền thông tin.");
        }
        if (!auth.user?.accessToken) {
            return toast.error("Vui lòng đăng nhập.");
        }

        const da = (await checkToken()) || auth.user?.accessToken;

        if (socket) {
            socket.emit("reply", {
                content: `<span>${name}</span>${" "}${
                    document.getElementById("commentContentReply").innerHTML
                }`,
                token: da,
                id: item?._id,
                slug: slug,
            });
            setReply(false);
        }
    };
    return (
        <div className="reply_container">
            <div className="comment_form_reply">
                <div
                    onInput={(e) => {
                        setContent(e.target.innerHTML);
                    }}
                    contentEditable="true"
                    id="commentContentReply"
                ></div>
                <div
                    style={content ? { display: "none" } : { display: "flex" }}
                    className="comment_title_input_reply"
                >
                    Trả lời bình luận của {name}
                </div>
            </div>
            <button onClick={handleCreateReply}>Gửi</button>
        </div>
    );
};

export default Reply;
