import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch } from "react-redux";
import { isFailing, isLoading, isSuccess } from "../redux/slice/auth";
import "./style.css";
const ChapterCard = ({
    update,
    setUpdate,
    item,
    updateUrl,
    setUpdateUrl,
    index,
}) => {
    const [imageH, setImageH] = useState("");
    const [imageT, setImageT] = useState("");
    const [imageU, setImageU] = useState("");

    const scrolRef = useRef();

    const [imgPo, setimgPo] = useState(null);

    const dispatch = useDispatch();

    const imgHRef = useRef("");
    const imgTRef = useRef("");
    const imgURef = useRef("");

    const currentRef = useRef(null);

    const onDrop = useCallback((acceptedFiles) => {
        const url = URL.createObjectURL(acceptedFiles[0]);
        if (imageH) {
            URL.revokeObjectURL(imageH);
        }
        if (imageT) {
            URL.revokeObjectURL(imageT);
        }

        if (currentRef.current === true) {
            imgHRef.current = acceptedFiles[0];
            setImageH(url);
        } else if (currentRef.current === false) {
            imgTRef.current = acceptedFiles[0];
            setImageT(url);
        } else if (currentRef.current === "Update") {
            imgURef.current = acceptedFiles[0];
            setImageU(url);
        }
    }, []);
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
    });

    useEffect(() => {
        if (imgPo === true) {
            imgTRef.current = "";
            setImageT("");
            imgURef.current = "";
            setImageU("");
        } else if (imgPo === false) {
            imgHRef.current = "";
            setImageH("");
            imgURef.current = "";
            setImageU("");
        } else if (imgPo === "Update") {
            imgTRef.current = "";
            setImageT("");
            imgHRef.current = "";
            setImageH("");
        } else {
            imgTRef.current = "";
            setImageT("");
            imgURef.current = "";
            setImageU("");
            imgHRef.current = "";
            setImageH("");
        }
    }, [imgPo]);

    const handleCreateImage = async () => {
        dispatch(isLoading());
        if (imgPo === "Update") {
            const formData = new FormData();
            formData.append("file", imgURef.current);
            formData.append("upload_preset", "stphim");
            try {
                const res = await axios.post(
                    "https://api.cloudinary.com/v1_1/sttruyen/image/upload",
                    formData
                );
                const newUrl = "https:" + res.data.url.split(":")[1];
                update.splice(index, 1, imageU);
                updateUrl.splice(index, 1, newUrl);
                setUpdate([...update]);
                item = imageU;
                setUpdateUrl([...updateUrl]);
                imgURef.current = "";
                setImageU("");
                setimgPo(null);
                dispatch(isSuccess());
            } catch (err) {
                console.log(err);
                dispatch(isFailing());
            }
            if (scrolRef.current) {
                scrolRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        } else if (imgPo === true) {
            const formData = new FormData();
            formData.append("file", imgHRef.current);
            formData.append("upload_preset", "stphim");
            try {
                const res = await axios.post(
                    "https://api.cloudinary.com/v1_1/sttruyen/image/upload",
                    formData
                );
                const newUrl = "https:" + res.data.url.split(":")[1];
                update.splice(index, 0, imageH);
                updateUrl.splice(index, 0, newUrl);
                setUpdate([...update]);
                setUpdateUrl([...updateUrl]);
                imgHRef.current = "";
                setImageH("");
                setimgPo(null);
                if (scrolRef.current) {
                    scrolRef.current.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }
                dispatch(isSuccess());
            } catch (err) {
                console.log(err);
                dispatch(isFailing());
            }
        } else if (imgPo === false) {
            const formData = new FormData();
            formData.append("file", imgTRef.current);
            formData.append("upload_preset", "stphim");
            try {
                const res = await axios.post(
                    "https://api.cloudinary.com/v1_1/sttruyen/image/upload",
                    formData
                );
                const newUrl = "https:" + res.data.url.split(":")[1];
                update.splice(index + 1, 0, imageT);
                updateUrl.splice(index + 1, 0, newUrl);
                setUpdate([...update]);
                setUpdateUrl([...updateUrl]);
                imgTRef.current = "";
                setImageT("");
                setimgPo(null);
                if (scrolRef.current) {
                    scrolRef.current.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }
                dispatch(isSuccess());
            } catch (err) {
                console.log(err);
                dispatch(isFailing());
            }
        }
    };

    const handleDeleteImage = () => {
        const checked = window.prompt("Xóa ảnh này?", "Yes");
        if (checked === "Yes") {
            update.splice(index, 1);
            updateUrl.splice(index, 1);
            setUpdate([...update]);
            setUpdateUrl([...updateUrl]);
        }
    };

    return (
        <div ref={scrolRef} className="chapterCard_wrap">
            {imgPo !== null && (
                <div className="chapter_card_add" {...getRootProps()}>
                    <input {...getInputProps()} />
                    {imgPo === true &&
                        (!imageH ? (
                            "Thêm ảnh vào đằng trước"
                        ) : (
                            <img src={imageH} />
                        ))}
                    {imgPo === false &&
                        (!imageT ? (
                            "Thêm ảnh vào đằng sau"
                        ) : (
                            <img src={imageT} />
                        ))}
                    {imgPo === "Update" &&
                        (!imageU ? "Cập nhật ảnh mới" : <img src={imageU} />)}
                </div>
            )}
            <div className="chapter_image_container_detail">
                <img src={item} />
                <div className="chapterCard_navbar_container">
                    <div className="chapterCard_navbar_items">
                        {(imgPo === true ||
                            imgPo === false ||
                            imgPo === "Update") && (
                            <button
                                title="Nhấn vào đây khi đã có ảnh trước hoặc sau hoặc cập nhật"
                                style={{
                                    backgroundColor: "#56CCF2",
                                    color: "white",
                                    border: "0.05rem solid rgba(0,0,0,0.5)",
                                }}
                                onClick={handleCreateImage}
                            >
                                {imgPo === true && "Chấp nhận ảnh trước"}
                                {imgPo === false && "Chấp nhận ảnh sau"}
                                {imgPo === "Update" && "Chấp nhận ảnh cập nhật"}
                            </button>
                        )}
                    </div>
                    <div className="chapterCard_navbar_items">
                        <button
                            title="Thêm ảnh vào trước ảnh này"
                            style={{
                                backgroundColor: "#FF8A08",
                                color: "white",
                                border: "0.05rem solid rgba(0,0,0,0.5)",
                            }}
                            onClick={() => {
                                if (imgPo === true) {
                                    currentRef.current = null;
                                    return setimgPo(null);
                                }
                                currentRef.current = true;
                                return setimgPo(true);
                            }}
                        >
                            {imgPo === true ? "Đang thêm trước" : "Thêm trước"}
                        </button>
                    </div>
                    <div className="chapterCard_navbar_items">
                        <button
                            title="Cập nhật ảnh này"
                            style={{
                                backgroundColor: "green",
                                color: "white",
                                border: "0.05rem solid rgba(0,0,0,0.5)",
                            }}
                            onClick={() => {
                                if (imgPo === "Update") {
                                    currentRef.current = null;
                                    return setimgPo(null);
                                }
                                currentRef.current = "Update";
                                return setimgPo("Update");
                            }}
                        >
                            {imgPo === "Update" ? "Đang Cập nhật" : "Cập nhật"}
                        </button>
                    </div>
                    <div className="chapterCard_navbar_items">
                        <button
                            title="Xóa ảnh này"
                            style={{
                                backgroundColor: "red",
                                color: "white",
                                border: "0.05rem solid rgba(0,0,0,0.5)",
                            }}
                            onClick={handleDeleteImage}
                        >
                            Xóa
                        </button>
                    </div>
                    <div className="chapterCard_navbar_items">
                        <button
                            title="Thêm ảnh vào sau ảnh này"
                            style={{
                                backgroundColor: "#FF8A08",
                                color: "white",
                                border: "0.05rem solid rgba(0,0,0,0.5)",
                            }}
                            onClick={() => {
                                if (imgPo === false) {
                                    currentRef.current = null;
                                    return setimgPo(null);
                                }
                                currentRef.current = false;
                                return setimgPo(false);
                            }}
                        >
                            {imgPo === false ? "Đang thêm sau" : "Thêm sau"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChapterCard;
