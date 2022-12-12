import axios from "axios";
import moment from "moment";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../App";
import { isFailing, isLoading, isSuccess } from "../redux/slice/auth";
import Reply from "./Reply";
import "./style.css";
const ReplyCard = React.memo(({ item, userid, parentId, chapter }) => {
    const [reply, setReply] = useState(false);

    const [like, setLike] = useState(true);

    const likeRef = useRef(0);

    const auth = useSelector((state) => state.auth);

    const contentRef = useRef();

    const [edit, setEdit] = useState(false);

    const { slug } = useParams();

    const { store, checkToken, socket } = useContext(UserContext);

    useEffect(() => {
        if (item) {
            likeRef.current = item?.likes;
            contentRef.current.innerHTML = `${item?.content}`;
        }
    }, [item, item?.content]);

    const handleDeleteComment = async () => {
        const da = (await checkToken()) || auth.user?.accessToken;
        if (socket) {
            socket.emit("deleteReplyComment", {
                slug: slug,
                token: da,
                id: item?._id,
                idparent: parentId?._id,
            });
        }
    };

    const [updateMessage, setUpdateMessage] = useState(false);

    const handleUpdateMessage = async () => {
        setUpdateMessage(false);
        contentRef.current.contentEditable = false;
        const detail = contentRef.current.innerHTML;
        const da = (await checkToken()) || auth.user?.accessToken;
        if (detail !== item?.content) {
            if (socket) {
                socket.emit("UpdateReplyMessage", {
                    id: item?._id,
                    content: detail,
                    slug: slug,
                    token: da,
                });
            }
        }
    };

    const handleEditMessage = () => {
        setEdit(false);
        setUpdateMessage(true);
        contentRef.current.contentEditable = true;
        contentRef.current.focus();
    };

    const handleCancelEdit = () => {
        setEdit(false);
        setUpdateMessage(false);
        contentRef.current.contentEditable = false;
    };

    const dispatch = useDispatch();
    const handleDeleteAdmin = async () => {
        const da = (await checkToken()) || auth.user?.accessToken;
        dispatch(isLoading());
        try {
            const data = await axios.delete(
                `/api/message/delete/admin/${item?._id}`,
                {
                    headers: {
                        token: `Bearer ${da}`,
                    },
                }
            );
            dispatch(isSuccess());
            toast.success(data?.data?.msg);
            setEdit(!edit);
        } catch (err) {
            dispatch(isFailing());
            return toast.error(err?.response?.data?.msg);
        }
    };
    const handleReport = async () => {
        const da = (await checkToken()) || auth.user?.accessToken;
        if (socket) {
            socket.emit("reports", {
                slug: slug,
                to: item,
            });
            toast.success(
                "Cảm ơn bạn đã báo cáo, chúng tôi sẽ xem xét lại bình luận này."
            );
            setEdit(!edit);
        }
    };

    return (
        <div className="reply_card_container">
            <div className="comment_card_image">
                <img src={item?.user?.image} />
            </div>
            <div className="comment_detail_wrap">
                <div className="comment_detail_container">
                    <div className="comment_detail_infor_container">
                        <div className="comment_detail_infor">
                            <h3>{item?.user?.name}</h3>
                            {chapter && <i>***Chương {chapter}</i>}
                            {updateMessage && (
                                <div className="update_button_container">
                                    <button onClick={handleUpdateMessage}>
                                        Cập nhật
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        style={{
                                            backgroundColor: "rgba(0,0,0,0.4)",
                                        }}
                                    >
                                        Hủy
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="comment_edit">
                            <i
                                onClick={() => {
                                    setEdit(!edit);
                                }}
                                style={{ cursor: "pointer" }}
                                className="fa-solid fa-angle-down"
                            ></i>
                            {edit &&
                                (item?.user?._id?.toString() === userid ? (
                                    <div className="comment_edit_container">
                                        <div
                                            onClick={handleEditMessage}
                                            className="comment_edit_items"
                                        >
                                            Chỉnh sửa
                                        </div>
                                        <div
                                            onClick={handleDeleteComment}
                                            className="comment_edit_items"
                                        >
                                            Xóa
                                        </div>
                                    </div>
                                ) : store?.rule === "admin" ? (
                                    <div className="comment_edit_container">
                                        <div
                                            onClick={handleDeleteAdmin}
                                            className="comment_edit_items"
                                        >
                                            Xóa
                                        </div>
                                    </div>
                                ) : (
                                    <div className="comment_edit_container">
                                        <div
                                            onClick={handleReport}
                                            className="comment_edit_items"
                                        >
                                            Báo cáo
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                    <div
                        ref={contentRef}
                        className="comment_detail_clearly"
                    ></div>
                </div>
                <div className="comment_navbar_container">
                    <div className="comment_navbar-like">
                        {likeRef.current}
                        {"  "}
                        <i
                            onClick={() => {
                                if (like) {
                                    likeRef.current++;
                                } else {
                                    likeRef.current--;
                                }
                                setLike(!like);
                            }}
                            style={{ cursor: "pointer" }}
                            className="fa-solid fa-thumbs-up icons_chane"
                        ></i>
                    </div>
                    <div
                        onClick={() => {
                            setReply(!reply);
                        }}
                        className="comment_navbar-reply"
                    >
                        <i
                            style={{ marginRight: "0.5rem" }}
                            className="fa-solid fa-comment"
                        ></i>
                        Trả lời
                    </div>
                    <div style={{ color: "rgba(0,0,0,0.4)" }}>
                        <i>
                            {item?.createdAt !== item?.updatedAt &&
                                "Đã chỉnh sửa "}
                            {item?.updatedAt &&
                                moment(item?.updatedAt).fromNow()}
                        </i>
                    </div>
                </div>
                {reply && (
                    <Reply
                        name={item?.user?.name}
                        setReply={setReply}
                        item={parentId}
                    />
                )}
            </div>
        </div>
    );
});

export default ReplyCard;
