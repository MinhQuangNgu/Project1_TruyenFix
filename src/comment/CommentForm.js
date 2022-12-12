import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import jwt_decode from "jwt-decode";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../App";
import CommentCard from "./CommentCard";
import "./style.css";
const CommentForm = React.memo(({ chapter }) => {
    const [content, setContent] = useState("");

    const { socket, checkToken } = useContext(UserContext);

    const [userId, setUserId] = useState("");

    const { slug } = useParams();

    const auth = useSelector((state) => state.auth);

    const [comments, setComments] = useState([]);

    const checkRef = useRef(false);

    useEffect(() => {
        if (socket) {
            socket.emit("join", {
                slug: slug,
            });
        }
    }, [slug, socket]);

    useEffect(() => {
        let here = true;
        const url = `/api/message/${slug}`;
        axios.get(url).then((res) => {
            if (here) {
                setComments(res?.data?.messages);
                checkRef.current = true;
            }
        });
        return () => {
            here = false;
        };
    }, [slug]);

    const handleComment = async () => {
        if (!document.getElementById("commentContent")) {
            return;
        }
        if (!document.getElementById("commentContent").innerHTML) {
            return toast.error("Vui lòng điền thông tin.");
        }
        if (!auth.user?.accessToken) {
            return toast.error("Vui lòng đăng nhập.");
        }
        const da = (await checkToken()) || auth.user?.accessToken;
        if (socket) {
            socket.emit("comment", {
                slug,
                token: da,
                content: document.getElementById("commentContent").innerHTML,
                chapter: chapter || "",
            });
        }
        document.getElementById("commentContent").innerHTML = "";
        setContent("");
    };

    useEffect(() => {
        if (socket) {
            if (checkRef.current) {
                socket.on("backMan", (infor) => {
                    comments.unshift({ ...infor });
                    setComments([...comments]);
                });
                socket.on("backRep", (infor) => {
                    const newArr = comments.map((item) => {
                        if (
                            item?._id?.toString() ===
                            infor?.commentid?.toString()
                        ) {
                            const check = item?.replies?.some(
                                (item) =>
                                    item?._id?.toString() ===
                                    infor?._id?.toString()
                            );
                            if (!check) {
                                const newObj = { ...infor };
                                delete newObj["commentid"];
                                item?.replies?.push({ ...newObj });
                            }
                        }
                        return item;
                    });
                    setComments(newArr);
                });
            }
        }
    }, [socket, comments]);

    useEffect(() => {
        if (auth.user?.accessToken) {
            const decode = jwt_decode(auth.user?.accessToken);
            setUserId(decode.id);
        }
    }, [auth.user?.accessToken]);
    useEffect(() => {
        if (socket) {
            socket.on("updateComment", (infor) => {
                const newArr = comments?.map((item) => {
                    if (item?._id?.toString() === infor?.id?.toString()) {
                        item.content = infor?.content;
                    }
                    return item;
                });
                setComments(newArr);
            });
            socket.on("updateCommentReply", (infor) => {
                const newArr = comments?.map((item) => {
                    const replie = item?.replies?.map((de) => {
                        if (de?._id?.toString() === infor?.id?.toString()) {
                            de.content = infor?.content;
                        }
                        return de;
                    });
                    item.replies = replie;
                    return item;
                });
                setComments([...newArr]);
            });
            socket.on("deleteMessageReply", (item) => {
                const dat = comments.filter(
                    (infor) => infor?._id?.toString() !== item?.id?.toString()
                );

                setComments(dat);
            });
            socket.on("deleteReplyBack", (infor) => {
                const newArr = comments?.map((item) => {
                    if (item?._id?.toString() === infor?.parentid?.toString()) {
                        item?.replies?.forEach((detail, index) => {
                            if (
                                detail?._id?.toString() ===
                                infor?.id?.toString()
                            ) {
                                item?.replies?.splice(index, 1);
                            }
                        });
                    }
                    return item;
                });
                setComments(newArr);
            });
        }
    }, [socket, comments]);

    return (
        <div className="comment_container">
            <div className="comment_send">
                <div className="comment_title">
                    <i
                        style={{
                            fontSize: "1.5rem",
                            marginTop: "0.5rem",
                            marginRight: "0.5rem",
                        }}
                        className="fa-solid fa-comment"
                    ></i>
                    <h1>Bình luận</h1>
                </div>
                <div className="comment_send_button">
                    <button onClick={handleComment}>Gửi</button>
                </div>
            </div>
            <div className="comment_form">
                <div
                    onInput={(e) => {
                        setContent(e.target.innerHTML);
                    }}
                    contentEditable="true"
                    id="commentContent"
                ></div>
                <div
                    style={content ? { display: "none" } : { display: "flex" }}
                    className="comment_title_input"
                >
                    Bình luận tại đây
                </div>
            </div>
            <div className="comment_items">
                {comments?.map((item) => (
                    <CommentCard
                        comments={comments}
                        setComments={setComments}
                        userid={userId}
                        key={item?._id + "Comment"}
                        item={item}
                    />
                ))}
            </div>
        </div>
    );
});

export default CommentForm;
