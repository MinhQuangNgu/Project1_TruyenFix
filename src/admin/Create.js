import axios from "axios";
import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { useDropzone } from "react-dropzone";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { UserContext } from "../App";
import "./style.css";
const Create = () => {
    const [image, setImage] = useState("");
    const imageRef = useRef("");
    const titleRef = useRef(null);
    const seTitleRef = useRef(null);
    const authorRef = useRef(null);
    const statusRef = useRef(null);
    const contentRef = useRef(null);
    const countryRef = useRef(null);

    const auth = useSelector((state) => state.auth);

    const { checkToken, cache } = useContext(UserContext);

    const [kinds, setKinds] = useState([]);
    const [countries, setCountries] = useState([]);

    const [creKinds, setCreKinds] = useState([]);

    useEffect(() => {
        let here = true;
        const url = "/api/kind";
        if (cache.current[url]) {
            setKinds(cache.current[url]);
            return;
        }
        axios
            .get(url)
            .then((res) => {
                if (here) {
                    setKinds(res?.data?.kinds);
                    cache.current[url] = res?.data?.kinds;
                }
            })
            .catch((err) => {
                toast.error(err?.response?.data?.msg);
            });
        return () => {
            here = false;
        };
    }, []);
    useEffect(() => {
        let here = true;
        const url = "/api/country";
        if (cache.current[url]) {
            setCountries(cache.current[url]);
            return;
        }
        axios
            .get(url)
            .then((res) => {
                if (here) {
                    setCountries(res?.data?.countries);
                    cache.current[url] = res?.data?.countries;
                }
            })
            .catch((err) => {
                toast.error(err?.response?.data?.msg);
            });
        return () => {
            here = false;
        };
    }, []);

    const handleChangeKinds = (e) => {
        if (e.target.checked) {
            setCreKinds([...creKinds, e.id]);
        } else {
            const newArr = creKinds.filter((item) => item !== e.id);
            setCreKinds(newArr);
        }
    };

    const handleCreateMovie = async () => {
        const movie = {
            title: titleRef.current?.value,
            seTitle: seTitleRef.current?.value,
            author: authorRef.current?.value,
            status: statusRef.current?.value,
            content: contentRef.current?.value,
            country: countryRef.current?.value,
            kinds: creKinds,
            image: imageRef.current,
        };

        const excludesFields = [
            "title",
            "seTitle",
            "author",
            "status",
            "content",
            "country",
            "image",
        ];
        let check = false;
        excludesFields.forEach((item) => {
            if (!movie[item]) {
                check = true;
            }
        });
        if (movie["kinds"].length === 0) {
            check = true;
        }
        if (check) {
            return toast.error("Vui lòng điền hết thông tin.");
        }
        const formData = new FormData();
        formData.append("file", imageRef.current);
        formData.append("upload_preset", "sttruyenxyz");
        try {
            const res = await axios.post(
                "https://api.cloudinary.com/v1_1/sttruyen/image/upload",
                formData
            );
            const newUrl = "https:" + res.data.url.split(":")[1];
            movie.image = newUrl;
        } catch (err) {
            return;
        }

        const da = (await checkToken()) || auth.user?.accessToken;
        try {
            const data = await axios.post(
                "/api/movie/create",
                {
                    ...movie,
                },
                {
                    headers: {
                        token: `Bearer ${da}`,
                    },
                }
            );
            toast.success(data?.data?.msg);
        } catch (err) {
            toast.error(err?.response?.data?.msg);
        }
        titleRef.current.value = "";
        seTitleRef.current.value = "";
        authorRef.current.value = "";
        statusRef.current.value = "";
        contentRef.current.value = "";
        imageRef.current = "";
        setImage("");
    };

    const onDrop = useCallback((acceptedFiles) => {
        const url = URL.createObjectURL(acceptedFiles[0]);
        if (image) {
            URL.revokeObjectURL(image);
        }
        imageRef.current = acceptedFiles[0];
        setImage(url);
    }, []);
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
    });
    return (
        <div className="create_container">
            <div className="grid wideS">
                <div className="create_wrap">
                    <div className="create_title">
                        <h1>Tạo truyện mới</h1>
                    </div>
                    <div className="create_image">
                        <div className="movie_drop_zone">
                            <div
                                className="movie_drop_zone_wrap"
                                {...getRootProps()}
                            >
                                <input {...getInputProps()} />
                                <i className="fa-regular fa-image"></i>
                                <div className="image_create_container">
                                    <img src={image} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="create_form">
                        <label>Tên truyện:</label>
                        <textarea
                            name="title"
                            ref={titleRef}
                            placeholder="Tên truyện"
                            type="text"
                        />
                    </div>
                    <div className="create_form">
                        <label>Tên khác:</label>
                        <textarea
                            name="seTitle"
                            ref={seTitleRef}
                            placeholder="Tên truyện khác"
                            type="text"
                        />
                    </div>
                    <div className="create_form">
                        <label>Tên tác giả:</label>
                        <textarea
                            name="author"
                            ref={authorRef}
                            placeholder="Tên tác giả"
                            type="text"
                        />
                    </div>
                    <div className="create_form">
                        <label>Tình trạng:</label>
                        <textarea
                            name="status"
                            ref={statusRef}
                            placeholder="Tình trạng"
                            type="text"
                        />
                    </div>
                    <div className="create_form">
                        <label>Nội dung:</label>
                        <textarea
                            name="content"
                            ref={contentRef}
                            style={{ minHeight: "15rem" }}
                            placeholder="Nội dung"
                            type="text"
                        />
                    </div>
                    <div className="create_kinds">
                        {kinds.map((item) => (
                            <div
                                key={item._id + "create"}
                                className="create_kinds_items"
                            >
                                <label htmlFor={item?._id}>{item?.name}</label>
                                <input
                                    onChange={(e) =>
                                        handleChangeKinds({
                                            ...e,
                                            id: item?._id,
                                        })
                                    }
                                    id={item?._id}
                                    type="checkbox"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="create_country">
                        <select ref={countryRef}>
                            {countries.map((item) => (
                                <option
                                    value={item?._id}
                                    key={item?._id + "craete"}
                                >
                                    {item?.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="create_button">
                        <button onClick={handleCreateMovie}>Tạo mới</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Create;
