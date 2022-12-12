import axios from "axios";
import moment from "moment";
import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../App";
import Reply from "./Reply";
import ReplyCard from "./ReplyCard";
import "./style.css";
const CommentCard = React.memo(({ item, userid }) => {
    const [reply, setReply] = useState(false);

    const [edit, setEdit] = useState(false);

    const { slug } = useParams();

    const { store, checkToken, socket } = useContext(UserContext);

    const [updateMessage, setUpdateMessage] = useState(false);

    const [like, setLike] = useState(true);

    const likeRef = useRef();

    const contenRef = useRef();

    const auth = useSelector((state) => state.auth);

    const handleDeleteComment = async () => {
        const da = (await checkToken()) || auth.user?.accessToken;
        if (socket) {
            socket.emit("deleteMessage", {
                id: item?._id,
                token: da,
                slug: slug,
            });
        }
    };
    useEffect(() => {
        if (item) {
            likeRef.current = item?.likes;
        }
    }, [item]);

    const handleLike = () => {
        if (socket) {
            socket.emit("Like", {
                id: item?._id,
                type: like,
            });
        }
        if (like) {
            likeRef.current++;
        } else {
            likeRef.current--;
        }
        setLike(!like);
    };

    const handleEditMessage = () => {
        setEdit(false);
        setUpdateMessage(true);
        contenRef.current.contentEditable = true;
        contenRef.current.focus();
    };

    const handleCancelEdit = () => {
        setEdit(false);
        setUpdateMessage(false);
        contenRef.current.contentEditable = false;
    };

    const handleUpdateMessage = async () => {
        contenRef.current.contentEditable = false;
        setUpdateMessage(false);
        const da = (await checkToken()) || auth.user?.accessToken;
        const detail = contenRef.current.innerHTML;
        if (detail !== item?.content) {
            if (socket) {
                socket.emit("UpdateMessage", {
                    id: item?._id,
                    content: detail,
                    slug: slug,
                    token: da,
                });
            }
        }
    };

    useEffect(() => {
        if (item) {
            contenRef.current.innerHTML = item?.content;
        }
    }, [item?.content]);

    const handleDeleteAdmin = async () => {
        const da = (await checkToken()) || auth.user?.accessToken;
        try {
            const data = await axios.delete(
                `/api/message/delete/admin/${item?._id}`,
                {
                    headers: {
                        token: `Bearer ${da}`,
                    },
                }
            );
            toast.success(data?.data?.msg);
            setEdit(!edit);
        } catch (err) {
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
        <div className="comment_card_container">
            <div className="comment_card_image">
                <img src={item?.user?.image} />
            </div>
            <div className="comment_detail_wrap">
                <div className="comment_detail_container">
                    <div className="comment_detail_infor_container">
                        <div className="comment_detail_infor">
                            <h3>{item?.user?.name}</h3>
                            {item?.chapter && <i>***Chương {item?.chapter}</i>}
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
                        ref={contenRef}
                        className="comment_detail_clearly"
                    ></div>
                </div>
                <div className="comment_navbar_container">
                    <div className="comment_navbar-like">
                        {likeRef.current || item?.likes}{" "}
                        <i
                            onClick={handleLike}
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
                        item={item}
                        setReply={setReply}
                        name={item?.user?.name}
                    />
                )}
                {item?.replies?.map((infor) => (
                    <ReplyCard
                        chapter={item?.chapter || ""}
                        userid={userid}
                        item={infor}
                        key={infor?._id + "Ads"}
                        parentId={item}
                    />
                ))}
            </div>
        </div>
    );
});

export default CommentCard;
