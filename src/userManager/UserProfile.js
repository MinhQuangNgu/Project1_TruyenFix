import axios from "axios";
import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { UserContext } from "../App";
import Card from "../card/Card";
import NotFound from "../notfound/NotFound";
import { isFailing, isLoading, isSuccess } from "../redux/slice/auth";
import "./style.css";
const UserProfile = () => {
    const [update, setUpdate] = useState(false);

    const [user, setUser] = useState("");

    const [img, setImg] = useState("");

    const auth = useSelector((state) => state.auth);

    const { checkToken } = useContext(UserContext);

    const dispatch = useDispatch();

    const [type, setType] = useState(false);

    const imgRef = useRef("");

    const onDrop = useCallback(
        (acceptedFiles) => {
            const url = URL.createObjectURL(acceptedFiles[0]);
            if (img) {
                URL.revokeObjectURL(img);
            }
            imgRef.current = acceptedFiles[0];
            setImg(url);
        },
        [img]
    );
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
    });

    const getuserProfile = async () => {
        const da = (await checkToken()) || auth.user?.accessToken;
        try {
            const data = await axios.get("/api/auth/user/profile", {
                headers: {
                    token: `Bearer ${da}`,
                },
            });
            setUser(data?.data?.user);
        } catch (err) {
            return toast.error(err?.response?.data?.msg);
        }
    };

    useEffect(() => {
        if (auth.user?.accessToken) {
            getuserProfile();
        }
    }, []);

    const handleUpdate = () => {
        setUpdate(true);
        if (document.getElementById("nameEdit")) {
            document.getElementById("nameEdit").contentEditable = true;
            document.getElementById("nameEdit").focus();
        }
    };

    const handleAgreeUpdate = async () => {
        if (document.getElementById("nameEdit")) {
            document.getElementById("nameEdit").contentEditable = false;
            const detail = document.getElementById("nameEdit").innerHTML;
            if (detail.length > 20) {
                toast.error("Tên cần ngắn hơn 20 kí tự");
                document.getElementById("nameEdit").innerHTML = user?.name;
            } else {
                let url = "";
                if (imgRef.current) {
                    const formData = new FormData();
                    formData.append("file", imgRef.current);
                    formData.append("upload_preset", "sttruyenxyz");
                    try {
                        const res = await axios.post(
                            "https://api.cloudinary.com/v1_1/sttruyen/image/upload",
                            formData
                        );
                        const newUrl = "https:" + res.data.url.split(":")[1];
                        url = newUrl;
                    } catch (err) {
                        return;
                    }
                }
                if (
                    imgRef.current ||
                    document.getElementById("nameEdit").innerHTML !== user?.name
                ) {
                    updateFunction({
                        url: url,
                        nameContent:
                            document.getElementById("nameEdit").innerHTML,
                    });
                }
            }
            setUpdate(false);
        }
    };

    const updateFunction = async ({ url, nameContent }) => {
        if (!url) {
            url = user?.image;
        }
        dispatch(isLoading());
        const da = (await checkToken()) || auth.user?.accessToken;
        try {
            const data = await axios.post(
                "/api/auth/user/profile/update",
                {
                    image: url,
                    name: nameContent,
                },
                {
                    headers: {
                        token: `Bearer ${da}`,
                    },
                }
            );
            dispatch(isSuccess());
            toast.success(data?.data?.msg);
        } catch (err) {
            dispatch(isFailing());
            return toast.error(err?.response?.data?.msg);
        }
    };

    const handleCancel = () => {
        if (document.getElementById("nameEdit")) {
            document.getElementById("nameEdit").contentEditable = false;
            document.getElementById("nameEdit").innerHTML = user?.name;
            setUpdate(false);
            setImg("");
            imgRef.current = "";
        }
    };

    return (
        <>
            {auth.user?.accessToken ? (
                <div className="user_profile_container">
                    <div className="grid wideS">
                        <div className="user_profile_wrap">
                            <div className="user_profile">
                                <div className="user_title">
                                    <h1>Thông tin của bạn</h1>
                                </div>
                                <div className="user_detail">
                                    <div className="user_detail_img">
                                        <img src={img || user?.image} />
                                        {update && (
                                            <div
                                                className="dropImage"
                                                {...getRootProps()}
                                            >
                                                <input {...getInputProps()} />
                                                <i className="fa-solid fa-image"></i>
                                            </div>
                                        )}
                                    </div>
                                    <div className="user_detail_small">
                                        <div className="user_detail_small_wrap">
                                            Tên:
                                            <span id="nameEdit">
                                                {user?.name}
                                            </span>
                                        </div>
                                        <div className="user_detail_small_wrap">
                                            Email:
                                            <span>{user?.email}</span>
                                        </div>
                                        {!update ? (
                                            <div className="user_detail_small_wrap">
                                                <button onClick={handleUpdate}>
                                                    Cập nhật
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="user_detail_small_wrap">
                                                <button
                                                    onClick={handleAgreeUpdate}
                                                >
                                                    Đồng ý
                                                </button>
                                                <button
                                                    onClick={handleCancel}
                                                    className="second_buton"
                                                >
                                                    Hủy
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="user_manager_reading">
                                <span
                                    onClick={() => {
                                        setType(false);
                                    }}
                                    className={!type ? "active" : ""}
                                >
                                    Truyện theo dõi
                                </span>
                                <span className="user_linethrough">|</span>
                                <span
                                    onClick={() => {
                                        setType(true);
                                    }}
                                    className={type ? "active" : ""}
                                >
                                    Truyện đã đọc
                                </span>
                            </div>
                            <div className="user_card_manager">
                                <div className="row">
                                    {!type
                                        ? user?.follows?.map((item) => (
                                              <div
                                                  key={item?._id + "mapItem"}
                                                  className="col c-6 m-3 l-2-4"
                                              >
                                                  <Card item={item} />
                                              </div>
                                          ))
                                        : user?.reads?.map((item) => (
                                              <div
                                                  key={
                                                      item?.readId?._id +
                                                      "mapItemRead"
                                                  }
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
            ) : (
                <NotFound />
            )}
        </>
    );
};

export default UserProfile;
